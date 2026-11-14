import subprocess
import time
import os
import sys
import json

PARENT_ID = "1oRw8zpRyT1J7JADlQ4jd8hSAmxBh6LgW"

def run_cmd(cmd):
    for i in range(5):
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if res.returncode == 0:
            return res.stdout
        time.sleep(2)
    return None

def upload_and_share(local_path):
    print(f"Uploading {local_path}...")
    cmd_upload = f'gdrive mutate upload --parent {PARENT_ID} "{local_path}"'
    stdout = run_cmd(cmd_upload)
    if not stdout:
        print(f"Failed to upload {local_path}")
        return None
    print(stdout.strip())
    file_id = None
    for line in stdout.splitlines():
        if "ID:" in line:
            file_id = line.split("ID:")[-1].strip().rstrip(")")
            break
    if file_id:
        cmd_share = f'gdrive mutate share {file_id} --role reader --type anyone'
        res_share = run_cmd(cmd_share)
        print(f"Shared {file_id} successfully: {res_share.strip() if res_share else ''}")
    return file_id

if __name__ == "__main__":
    deck_pdf = os.path.abspath("presentation/AETHER_NASA_Pitch_Deck.pdf")
    file_id = upload_and_share(deck_pdf)
    print("ALL DONE. PITCH_DECK_PDF_ID:", file_id)
