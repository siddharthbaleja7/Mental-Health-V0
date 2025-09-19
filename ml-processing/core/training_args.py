from transformers import TrainingArguments

def get_training_args(output_dir="outputs"):
    return TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=3,
        learning_rate=2e-5,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        weight_decay=0.01,
        report_to="none",      # disables WandB, etc.
        logging_steps=50,
        evaluation_strategy="epoch",
        save_total_limit=2,
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
    )
