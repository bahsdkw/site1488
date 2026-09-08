"""Продвинутый счетчик нажатий.

Каждое нажатие на кнопку генерирует случайную цифру (0-9), отображает её
на экране и сохраняет в памяти приложения (в списке истории). Также
отображается статистика: количество нажатий, сумма, среднее значение,
самая частая цифра и полная история сгенерированных цифр.

Запуск:
    python3 tap_counter.py
"""

import random
import tkinter as tk
from collections import Counter
from tkinter import ttk


class TapCounterApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("Продвинутый счетчик нажатий")
        self.root.geometry("420x560")
        self.root.minsize(380, 480)

        # Память приложения: список всех сгенерированных цифр по порядку.
        self.history: list[int] = []

        self._build_ui()
        self._update_stats()

    def _build_ui(self) -> None:
        main = ttk.Frame(self.root, padding=16)
        main.pack(fill="both", expand=True)

        title = ttk.Label(main, text="Счётчик нажатий", font=("Segoe UI", 16, "bold"))
        title.pack(pady=(0, 12))

        # Большая метка с последней сгенерированной цифрой.
        self.digit_var = tk.StringVar(value="—")
        self.digit_label = ttk.Label(
            main,
            textvariable=self.digit_var,
            font=("Segoe UI", 72, "bold"),
            anchor="center",
        )
        self.digit_label.pack(pady=12)

        # Кнопка-экран для нажатий.
        self.tap_button = tk.Button(
            main,
            text="НАЖМИ МЕНЯ",
            font=("Segoe UI", 14, "bold"),
            bg="#4a90d9",
            fg="white",
            activebackground="#357abd",
            activeforeground="white",
            relief="flat",
            height=3,
            command=self.on_tap,
        )
        self.tap_button.pack(fill="x", pady=(0, 16))
        self.root.bind("<space>", lambda event: self.on_tap())

        # Статистика.
        stats_frame = ttk.LabelFrame(main, text="Статистика", padding=10)
        stats_frame.pack(fill="x", pady=(0, 12))

        self.count_var = tk.StringVar()
        self.sum_var = tk.StringVar()
        self.avg_var = tk.StringVar()
        self.mode_var = tk.StringVar()

        for label, var in (
            ("Нажатий:", self.count_var),
            ("Сумма цифр:", self.sum_var),
            ("Среднее значение:", self.avg_var),
            ("Самая частая цифра:", self.mode_var),
        ):
            row = ttk.Frame(stats_frame)
            row.pack(fill="x", pady=2)
            ttk.Label(row, text=label, width=20).pack(side="left")
            ttk.Label(row, textvariable=var, font=("Segoe UI", 10, "bold")).pack(side="left")

        # История нажатий.
        history_frame = ttk.LabelFrame(main, text="История (память приложения)", padding=10)
        history_frame.pack(fill="both", expand=True)

        list_container = ttk.Frame(history_frame)
        list_container.pack(fill="both", expand=True)

        scrollbar = ttk.Scrollbar(list_container)
        scrollbar.pack(side="right", fill="y")

        self.history_listbox = tk.Listbox(
            list_container,
            yscrollcommand=scrollbar.set,
            font=("Consolas", 10),
        )
        self.history_listbox.pack(side="left", fill="both", expand=True)
        scrollbar.config(command=self.history_listbox.yview)

        reset_button = ttk.Button(main, text="Сбросить", command=self.on_reset)
        reset_button.pack(fill="x", pady=(12, 0))

    def on_tap(self) -> None:
        digit = random.randint(0, 9)
        self.history.append(digit)

        self.digit_var.set(str(digit))
        self.history_listbox.insert(
            "end", f"#{len(self.history):>4}  ->  {digit}"
        )
        self.history_listbox.see("end")

        self._update_stats()

    def on_reset(self) -> None:
        self.history.clear()
        self.digit_var.set("—")
        self.history_listbox.delete(0, "end")
        self._update_stats()

    def _update_stats(self) -> None:
        count = len(self.history)
        total = sum(self.history)
        average = total / count if count else 0.0

        if self.history:
            counts = Counter(self.history)
            most_common_digit, most_common_freq = counts.most_common(1)[0]
            mode_text = f"{most_common_digit} ({most_common_freq} раз)"
        else:
            mode_text = "—"

        self.count_var.set(str(count))
        self.sum_var.set(str(total))
        self.avg_var.set(f"{average:.2f}")
        self.mode_var.set(mode_text)


def main() -> None:
    root = tk.Tk()
    TapCounterApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
