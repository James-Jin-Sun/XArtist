
train_configs = {
  # Dataset Config
  "DATASET_PATH": "..",

  # Dumping Config
  "MODEL_DUMPING_PATH": ".",
  "IMG_DUMPING_PATH": ".",
  "IMAGE_DUMPING_FREQUENCY": 1,
  "MODEL_DUMPING_FREQUENCY": 30,
  "LOG_FREQUENCY": 1,

  # Model Config
  "ARCH": "SNDCGAN256",
  "EPOCHS": 600,
  "BOTTOM_SIZE": 4,
  "INPUT_DIM": 256,
  "INPUT_CHN": 3,
  "LATENT_DIM": 128,
  "BATCH_SIZE": 12,
  "GEN_FILTERS": 64,
  "DIS_FILTERS": 64,
  "CATEGORY_GENRE": "genre",
  "LABEL_FILTERS": [9],
  "GEN_LR": 0.0002,
  "DIS_LR": 0.0002,
  "ADAM_BETA1": 0.5,
  "ADAM_BETA2": 0.999,
  "TORCH_WORKERS": 3,
  "LOSS_FN": "hinge", # 'bce' or 'hinge',
  "N_DIS": 4,
  "N_GEN": 1,
}