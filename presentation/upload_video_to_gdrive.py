import subprocess
import time
import os
import sys

def upload_file(local_path, parent_id):
    if not os.path.exists(local_path):
        print(f"Error: {local_path} not found.")
        sys.exit(1)
        
    cmd = [
        "gdrive", "mutate", "upload",
        "--parent", parent_id,
        local_path
    ]
    
    print(f"Uploading {local_path} to Google Drive parent {parent_id}...")
    for attempt in range(1, 6):
        res = subprocess.run(cmd, capture_output=True, text=True, shell=True)
        if res.returncode == 0:
            print("Upload succeeded!")
            print(res.stdout)
            return res.stdout
        else:
            print(f"Attempt {attempt} failed: {res.stderr.strip() or res.stdout.strip()}")
            if "wsarecv" in res.stderr.lower() or "connection was forcibly closed" in res.stderr.lower():
                time.sleep(2)
                continue
            else:
                time.sleep(1)
    print("All upload attempts failed.")
    sys.exit(1)

if __name__ == "__main__":
    local_path = os.path.abspath("presentation/assets/AETHER_30s_Walkthrough_Video.mp4")
    parent_id = "1oRw8zpRyT1J7JADlQ4jd8hSAmxBh6LgW"
    upload_file(local_path, parent_id)
