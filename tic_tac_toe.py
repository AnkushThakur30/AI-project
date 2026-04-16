import math

HUMAN = "X"
AI = "O"
EMPTY = " "

WIN_COMBINATIONS = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
]


def display_board(board):
    print()
    print(f" {board[0]} | {board[1]} | {board[2]} ")
    print("---+---+---")
    print(f" {board[3]} | {board[4]} | {board[5]} ")
    print("---+---+---")
    print(f" {board[6]} | {board[7]} | {board[8]} ")
    print()


def check_winner(board):
    for a, b, c in WIN_COMBINATIONS:
        if board[a] == board[b] == board[c] != EMPTY:
            return board[a]
    if EMPTY not in board:
        return "Draw"
    return None


def get_available_moves(board):
    return [i for i, square in enumerate(board) if square == EMPTY]


def minimax(board, player):
    winner = check_winner(board)
    if winner == AI:
        return {"score": 10}
    if winner == HUMAN:
        return {"score": -10}
    if winner == "Draw":
        return {"score": 0}

    if player == AI:
        best = {"score": -math.inf}
    else:
        best = {"score": math.inf}

    for move in get_available_moves(board):
        board[move] = player
        score = minimax(board, HUMAN if player == AI else AI)["score"]
        board[move] = EMPTY

        if player == AI:
            if score > best["score"]:
                best = {"score": score, "move": move}
        else:
            if score < best["score"]:
                best = {"score": score, "move": move}

    return best


def best_move(board):
    return minimax(board, AI).get("move")


def print_instructions():
    print("Welcome to Tic-Tac-Toe with Minimax AI!")
    print("You play as X and the AI plays as O.")
    print("Enter a number from 1 to 9 to place your move.")
    print("The board positions map like this:")
    print(" 1 | 2 | 3 ")
    print("---+---+---")
    print(" 4 | 5 | 6 ")
    print("---+---+---")
    print(" 7 | 8 | 9 ")
    print()


def play_game():
    board = [EMPTY] * 9
    print_instructions()
    display_board(board)

    current_player = HUMAN
    while True:
        if current_player == HUMAN:
            try:
                move = int(input("Choose your move (1-9): ").strip()) - 1
            except ValueError:
                print("Please enter a valid number between 1 and 9.")
                continue

            if move < 0 or move > 8 or board[move] != EMPTY:
                print("That move is not valid. Try again.")
                continue
        else:
            move = best_move(board)
            print(f"AI chooses position {move + 1}")

        board[move] = current_player
        display_board(board)

        winner = check_winner(board)
        if winner:
            if winner == HUMAN:
                print("You win! Congratulations!")
            elif winner == AI:
                print("AI wins. Better luck next time!")
            else:
                print("It's a draw.")
            break

        current_player = AI if current_player == HUMAN else HUMAN


if __name__ == "__main__":
    play_game()
