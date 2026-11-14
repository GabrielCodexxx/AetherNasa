import subprocess
import time
import re
import json

def run_cmd(cmd):
    for attempt in range(5):
        try:
            res = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
            return res
        except subprocess.CalledProcessError as e:
            print(f"Attempt {attempt+1} failed: {e.output.strip()}")
            time.sleep(2)
    raise RuntimeError(f"Failed after 5 attempts: {cmd}")

def main():
    pdf_path = "c:/Users/porti/Aether/presentation/AETHER_NASA_Formal_Documentation.pdf"
    folder_id = "1oRw8zpRyT1J7JADlQ4jd8hSAmxBh6LgW"

    print("Uploading formal documentation PDF to Google Drive...")
    res = run_cmd(f'gdrive mutate upload "{pdf_path}" --parent {folder_id}')
    print("Output:", res.strip())
    match = re.search(r'\(ID:\s*([a-zA-Z0-9_-]+)\)', res)
    doc_id = match.group(1) if match else res.strip().split()[-1]
    doc_url = f"https://drive.google.com/file/d/{doc_id}/view"
    print("Formal Documentation PDF URL:", doc_url)

    with open("c:/Users/porti/Aether/presentation/gdrive_links.json", "r", encoding="utf-8") as f:
        links = json.load(f)

    links["formal_documentation_pdf_id"] = doc_id
    links["formal_documentation_pdf_url"] = doc_url

    with open("c:/Users/porti/Aether/presentation/gdrive_links.json", "w", encoding="utf-8") as f:
        json.dump(links, f, indent=2)

    print("\nUpdated gdrive_links.json successfully:")
    print(json.dumps(links, indent=2))

if __name__ == "__main__":
    main()
