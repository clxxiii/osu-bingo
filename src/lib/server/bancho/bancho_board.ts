import { sendMessage } from ".";


export const sendBoard = async (user_id: number, card: Bingo.Card) => {
  const board = banchoBoard(card);
  if (!board) return;
  const strings = [
    "Hey there! It's clx, the developer of osu!bingo. You asked for a board so here it is, Good Luck!",
    ...board.map(x => x.join(' '))
  ]
  await sendMessage(strings, user_id);
}

/**
 * Converts a bingo card to a card that will show up correctly in osu! chat
 */
const banchoBoard = (card: Bingo.Card): string[][] | null => {
  if (!card.squares) return null;

  const yMax = Math.max(...card.squares.map((x) => x.y_pos));
  const xMax = Math.max(...card.squares.map((x) => x.x_pos));

  const output = new Array(yMax + 1).fill("    ");
  for (let i = 0; i < output.length; i++) {
    output[i] = new Array(xMax + 1);
  }

  for (let i = 0; i < card.squares.length; i++) {
    const square = card.squares[i]
    // console.log({ y: square.y_pos, output: output[square.y_pos] })
    output[square.y_pos][square.x_pos] = linkify(square)
  }
  return output;
}

const linkify = (square: Bingo.Card.FullSquare) => {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return `[https://osu.ppy.sh/b/${square.map_id} [${alpha.charAt(square.y_pos)}${square.x_pos + 1}]]`
}