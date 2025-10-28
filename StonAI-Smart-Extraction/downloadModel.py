import gdown



url = "https://drive.google.com/u/0/uc?id=1-DpGpFf7TlbBKJUyogjAseCT6213tY7S"
output="/home/ubuntu/new_submittals_saved_weights.pt"
gdown.download(url, output, quiet=False)