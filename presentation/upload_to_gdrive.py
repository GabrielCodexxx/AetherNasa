import subprocess
import json
import time
import re

def run_cmd(cmd):
    for attempt in range(5):
        try:
            res = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
            return res
        except subprocess.CalledProcessError as e:
            print(f"Attempt {attempt+1} failed: {e.output.strip()}")
            time.sleep(2)
    raise RuntimeError(f"Failed after 5 attempts: {cmd}")

def extract_id(text):
    match = re.search(r'\(ID:\s*([a-zA-Z0-9_-]+)\)', text)
    if match:
        return match.group(1)
    # Fallback to last token or plain ID
    tokens = text.strip().split()
    return tokens[-1]

def main():
    folder_id = "1oRw8zpRyT1J7JADlQ4jd8hSAmxBh6LgW"
    print(f"Using created Folder ID: {folder_id}")
    folder_url = f"https://drive.google.com/drive/folders/{folder_id}"
    print(f"Folder URL: {folder_url}")

    pdf_file = "c:/Users/porti/Aether/presentation/AETHER_NASA_Pitch_Deck.pdf"
    pptx_file = "c:/Users/porti/Aether/presentation/AETHER_NASA_Pitch_Deck.pptx"

    print("Uploading PDF to Google Drive folder...")
    res_pdf = run_cmd(f'gdrive mutate upload "{pdf_file}" --parent {folder_id}')
    print("PDF output:", res_pdf.strip())
    pdf_id = extract_id(res_pdf)
    pdf_url = f"https://drive.google.com/file/d/{pdf_id}/view"
    print(f"PDF URL: {pdf_url}")

    print("Uploading PPTX to Google Drive folder...")
    res_pptx = run_cmd(f'gdrive mutate upload "{pptx_file}" --parent {folder_id}')
    print("PPTX output:", res_pptx.strip())
    pptx_id = extract_id(res_pptx)
    pptx_url = f"https://drive.google.com/file/d/{pptx_id}/view"
    print(f"PPTX URL: {pptx_url}")

    pres_id = "1B2-Z6bPb98kSZnAZ7M3P_sJs-tFniLMJwZksukS8UYE"
    slides_url = f"https://docs.google.com/presentation/d/{pres_id}/edit"

    output = {
        "folder_id": folder_id,
        "folder_url": folder_url,
        "pdf_id": pdf_id,
        "pdf_url": pdf_url,
        "pptx_id": pptx_id,
        "pptx_url": pptx_url,
        "slides_url": slides_url
    }

    with open("c:/Users/porti/Aether/presentation/gdrive_links.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print("\n================ SUCCESS ================")
    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
