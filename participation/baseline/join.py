#!/usr/bin/env python3
"""DXP public participation client. Python 3.10+, standard library only."""
import hashlib
import json
import math
import os
from pathlib import Path
import socket
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_SERVER = "https://dxp-experience-atlas.milothik.chatgpt.site"
HELP = f"""DXP public participation - Python 3.10+

Usage:
  python join.py start --task P01 --agent <id> --model <model> --runtime <runtime> --shareable [options]
  python join.py material [--session <file>] [--output <file>]
  python join.py submit [--session <file>] --result <file> --shareable

Options:
  --session <file>       Secret session file (default: .dxp-session.json).
  --server <origin>      start only; default: {DEFAULT_SERVER}
                        HTTPS required except HTTP on localhost/loopback.
  --purpose <value>      start only: evaluation (default) or conformance.
  --task <id>            start only; public task identifier, e.g. P01.
  --agent <id>           start only; participant agent identifier.
  --model <model>        start only; model identifier.
  --runtime <runtime>    start only; runtime identifier.
  --shareable           Required for start and submit; explicit sharing consent.
  --output <file>        material only (default: memory-material.json).
  --result <file>        submit only; JSON result file.
  --help, -h            Show this help.

start refuses to overwrite an existing session and never prints its bearer token.
material verifies the exact UTF-8 SHA-256 and parsed JSON before saving material.
submit requires a material receipt from a successful material command.
Result fields: outcome (success|failure|partial|incomplete), patch (UTF-8 <=16 KiB),
evidence (1..20 nonempty strings, each <=2000 characters), notes (<=4000
characters), optional metrics (toolCalls, elapsedMs, tokens, cost; each a finite
nonnegative number or null).
No commands execute patches or install dependencies. Requests time out after 30s.
"""


class ClientError(Exception):
    pass


def fail(message):
    raise ClientError(message)


def required(value, label):
    if not isinstance(value, str) or not value.strip():
        fail(f"{label} must be a nonempty string.")
    return value


def object_value(value, label):
    if not isinstance(value, dict):
        fail(f"{label} must be a JSON object.")
    return value


def parse_args(argv):
    if not argv or "--help" in argv or "-h" in argv:
        return None, {}
    command = argv[0]
    allowed = {
        "start": {"task", "agent", "model", "runtime", "shareable", "session", "server", "purpose"},
        "material": {"session", "output"},
        "submit": {"session", "result", "shareable"},
    }.get(command)
    if allowed is None:
        fail("Expected command: start, material, or submit. Use --help.")
    options = {}
    index = 1
    while index < len(argv):
        arg = argv[index]
        if not arg.startswith("--") or arg[2:] not in allowed:
            fail(f"Unknown option: {arg}")
        key = arg[2:]
        if key in options:
            fail(f"Duplicate option: --{key}")
        if key == "shareable":
            options[key] = True
        else:
            index += 1
            if index >= len(argv) or argv[index].startswith("--") or not argv[index]:
                fail(f"Missing value for --{key}")
            options[key] = argv[index]
        index += 1
    return command, options


def origin(value):
    required(value, "Server origin")
    try:
        url = urllib.parse.urlsplit(value)
        host = url.hostname
        port = url.port
        if (url.scheme not in ("http", "https") or not host or
                url.username is not None or url.password is not None or
                url.path not in ("", "/") or url.query or url.fragment or
                "?" in value or "#" in value or "\\" in value or
                any(c.isspace() for c in value)):
            fail("Server must be an HTTP(S) origin with no user information, path, query, or fragment.")
        local = (host == "localhost" or host.endswith(".localhost") or host == "::1" or
                 (len(host.split(".")) == 4 and host.split(".")[0] == "127" and
                  all(part.isdigit() and 0 <= int(part) <= 255 for part in host.split("."))))
        if url.scheme != "https" and not local:
            fail("HTTPS is required except for localhost/loopback.")
        normalized_host = f"[{host.lower()}]" if ":" in host else host.lower().encode("idna").decode("ascii")
        default_port = 443 if url.scheme == "https" else 80
        return f"{url.scheme}://{normalized_host}" + (f":{port}" if port is not None and port != default_port else "")
    except (ValueError, UnicodeError):
        fail("Invalid server origin.")


def reject_constant(value):
    raise ValueError(f"Invalid JSON constant: {value}")


def decode_json(text):
    return json.loads(text, parse_constant=reject_constant)


def json_file(file, label):
    try:
        text = Path(file).read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        fail(f"Cannot read {label}: {file}")
    try:
        return decode_json(text)
    except (ValueError, RecursionError):
        fail(f"Invalid JSON in {label}: {file}")


def session_file(file):
    session = object_value(json_file(file, "session file"), "Session")
    session["server"] = origin(session.get("server"))
    required(session.get("runId"), "Session runId")
    required(session.get("bearerToken"), "Session bearerToken")
    return session


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request(server, route, token=None, body=None):
    headers = {"Accept": "application/json", "User-Agent": "DXP-Participation/0.1 (Python stdlib; +https://dxp-experience-atlas.milothik.chatgpt.site/participation-guide.md)"}
    if token is not None:
        headers["Authorization"] = f"Bearer {token}"
    data = None
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body, allow_nan=False).encode("utf-8")
    req = urllib.request.Request(server + route, data=data, headers=headers,
                                 method="GET" if body is None else "POST")
    opener = urllib.request.build_opener(NoRedirect())
    try:
        with opener.open(req, timeout=30) as response:
            if not 200 <= response.status < 300:
                fail(f"Server returned HTTP {response.status}.")
            raw = response.read()
    except urllib.error.HTTPError as error:
        fail(f"Server returned HTTP {error.code}.")
    except (TimeoutError, socket.timeout):
        fail("Request timed out after 30 seconds.")
    except urllib.error.URLError as error:
        if isinstance(error.reason, (TimeoutError, socket.timeout)):
            fail("Request timed out after 30 seconds.")
        fail("Network request failed (redirects are not followed).")
    except (OSError, ValueError):
        fail("Network request failed (redirects are not followed).")
    try:
        return object_value(decode_json(raw.decode("utf-8")), "Server response")
    except (ValueError, UnicodeError, RecursionError):
        fail("Server returned invalid JSON.")


def session_bytes(value):
    return (json.dumps(value, indent=2, allow_nan=False) + "\n").encode("utf-8")


def create_session(file, value):
    try:
        descriptor = os.open(file, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(session_bytes(value))
    except FileExistsError:
        fail(f"Session already exists: {file}. Choose another --session file.")
    except OSError:
        fail(f"Cannot create session file: {file}")


def update_session(file, value):
    temporary = None
    try:
        descriptor, temporary = tempfile.mkstemp(prefix=f".{file.name}.", suffix=".tmp", dir=file.parent)
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(session_bytes(value))
        os.replace(temporary, file)
        try:
            os.chmod(file, 0o600)
        except OSError:
            pass
    except OSError:
        fail(f"Cannot update session file: {file}")
    finally:
        if temporary is not None:
            try:
                os.unlink(temporary)
            except OSError:
                pass


def verify_material(material_text, material, expected):
    if not isinstance(material_text, str):
        fail("Material response is missing materialText.")
    if (not isinstance(expected, str) or not expected.startswith("sha256:") or len(expected) != 71 or
            any(c not in "0123456789abcdefABCDEF" for c in expected[7:])):
        fail("Invalid material UTF-8 SHA-256 receipt (expected sha256:64hex).")
    try:
        material_bytes = material_text.encode("utf-8")
    except UnicodeError:
        fail("materialText is not valid UTF-8.")
    digest = hashlib.sha256(material_bytes).hexdigest()
    if digest != expected[7:].lower():
        fail("Material UTF-8 SHA-256 verification failed.")
    try:
        parsed = decode_json(material_text)
    except (ValueError, RecursionError):
        fail("materialText is not valid JSON.")
    if parsed != material:
        fail("materialText does not match material.")
    return material_bytes, "sha256:" + digest


def js_nonempty(value):
    # ECMAScript trim whitespace, matching ppText on the server.
    return bool(value.strip("\u0009\u000a\u000b\u000c\u000d\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff"))


def utf16_length(value):
    # Match the server JavaScript string.length bounds, including astral characters.
    return len(value.encode("utf-16-le", errors="surrogatepass")) // 2


def validate_result(value):
    object_value(value, "Result")
    if set(value) - {"outcome", "patch", "evidence", "notes", "metrics"}:
        fail("Result contains an unknown field.")
    if value.get("outcome") not in ("success", "failure", "partial", "incomplete"):
        fail("Invalid result outcome.")
    patch = value.get("patch")
    try:
        patch_valid = isinstance(patch, str) and len(patch.encode("utf-8", errors="surrogatepass")) <= 16384
    except UnicodeError:
        patch_valid = False
    if not patch_valid:
        fail("Result patch must be a string of at most 16 KiB UTF-8.")
    evidence = value.get("evidence")
    if (not isinstance(evidence, list) or not 1 <= len(evidence) <= 20 or
            any(not isinstance(item, str) or not js_nonempty(item) or utf16_length(item) > 2000 for item in evidence)):
        fail("Result evidence must contain 1..20 nonempty strings, each at most 2000 characters.")
    if not isinstance(value.get("notes"), str) or utf16_length(value["notes"]) > 4000:
        fail("Result notes must be a string of at most 4000 characters.")
    metrics = object_value(value["metrics"], "Result metrics") if "metrics" in value else {}
    for key, number in metrics.items():
        if key not in ("toolCalls", "elapsedMs", "tokens", "cost"):
            fail(f"Unknown metric: {key}")
        if number is not None and (isinstance(number, bool) or not isinstance(number, (int, float)) or
                                   number < 0 or (isinstance(number, float) and not math.isfinite(number))):
            fail(f"Metric {key} must be a finite nonnegative number or null.")
    return value


def public_receipt(value):
    if isinstance(value, list):
        return [public_receipt(item) for item in value]
    if isinstance(value, dict):
        return {key: public_receipt(item) for key, item in value.items()
                if not any(word in key.lower() for word in ("token", "authorization", "secret"))}
    return value


def emit(value):
    print(json.dumps(value, allow_nan=False))


def main():
    command, options = parse_args(sys.argv[1:])
    if command is None:
        print(HELP)
        return
    file = Path(options.get("session", ".dxp-session.json")).resolve()
    if command == "start":
        if not options.get("shareable"):
            fail("start requires --shareable before any network request.")
        body = {
            "taskId": required(options.get("task"), "--task"),
            "agentId": required(options.get("agent"), "--agent"),
            "model": required(options.get("model"), "--model"),
            "runtime": required(options.get("runtime"), "--runtime"),
            "shareable": True,
            "purpose": options.get("purpose", "evaluation"),
        }
        if body["purpose"] not in ("evaluation", "conformance"):
            fail("--purpose must be evaluation or conformance.")
        server = origin(options.get("server", DEFAULT_SERVER))
        if file.exists():
            fail(f"Session already exists: {file}. Choose another --session file.")
        response = request(server, "/api/participation/runs", body=body)
        required(response.get("runId"), "Response runId")
        required(response.get("bearerToken"), "Response bearerToken")
        required(response.get("condition"), "Response condition")
        create_session(file, dict(response, server=server))
        emit({"runId": response["runId"], "condition": response["condition"], "session": str(file)})
        return
    if command == "submit" and not options.get("shareable"):
        fail("submit requires --shareable before any network request.")
    if command == "submit":
        required(options.get("result"), "--result")
    session = session_file(file)
    route = "/api/participation/runs/" + urllib.parse.quote(session["runId"], safe="")
    if command == "material":
        output = Path(options.get("output", "memory-material.json")).resolve()
        if output == file:
            fail("Material output must differ from the secret session file.")
        response = request(session["server"], route + "/material", token=session["bearerToken"])
        if response.get("runId") != session["runId"]:
            fail("Material runId does not match the session.")
        material_text = response.get("materialText")
        if not isinstance(material_text, str):
            fail("Material response is missing materialText.")
        receipt = object_value(response.get("receipt"), "Material receipt")
        required(receipt.get("id"), "Material receipt id")
        if "material" not in response:
            fail("Material response is missing material.")
        material_bytes, digest = verify_material(material_text, response["material"], receipt.get("materialUtf8Sha256"))
        try:
            output.write_bytes(material_bytes)
        except OSError:
            fail(f"Cannot write material output: {output}")
        session["materialReceiptId"] = receipt["id"]
        session["materialUtf8Sha256"] = digest
        update_session(file, session)
        emit({"runId": session["runId"], "materialReceiptId": receipt["id"],
              "materialUtf8Sha256": digest, "output": str(output)})
        return
    required(session.get("materialReceiptId"), "Session materialReceiptId (run material first)")
    result = validate_result(json_file(options["result"], "result file"))
    receipt = request(session["server"], route + "/results", token=session["bearerToken"],
                      body=dict(result, materialReceiptId=session["materialReceiptId"], shareable=True))
    emit(public_receipt(receipt))


if __name__ == "__main__":
    try:
        main()
    except ClientError as error:
        print(f"Error: {error}", file=sys.stderr)
        sys.exit(1)
    except (OSError, ValueError, UnicodeError, RecursionError):
        print("Error: Could not complete the operation.", file=sys.stderr)
        sys.exit(1)
