function setPixel(xx: number, yy: number, pow: number) {
    if (pow > 0) {
        led.plot(xx, yy)
    } else {
        led.unplot(xx, yy)
    }
}
function hideBrick() {
    if (x > 0) {
        setPixel(x - 1, y, grid[y][x])
    }
    if (x < 5) {
        setPixel(x + 1 - 1, y, grid[y][x + 1])
    }
    if (x > 0 && y < 4) {
        setPixel(x - 1, y + 1, grid[y + 1][x])
    }
    if (x < 5 && y < 4) {
        setPixel(x + 1 - 1, y + 1, grid[y + 1][x + 1])
    }
}
function showBrick() {
    if (x > 0) {
        setPixel(x - 1, y, max(brick[0][0], grid[y][x]))
    }
    if (x < 5) {
        setPixel(x + 1 - 1, y, max(brick[0][1], grid[y][x + 1]))
    }
    if (x > 0 && y < 4) {
        setPixel(x - 1, y + 1, max(brick[1][0], grid[y + 1][x]))
    }
    if (x < 5 && y < 4) {
        setPixel(x + 1 - 1, y + 1, max(brick[1][1], grid[y + 1][x + 1]))
    }
}
function rotateBrick() {
    pixel00 = brick[0][0]
    pixel01 = brick[0][1]
    pixel10 = brick[1][0]
    pixel11 = brick[1][1]
    // Check if the rotation is possible
    if (!(grid[y][x] > 0 && pixel10 > 0 || grid[y + 1][x] > 0 && pixel11 > 0 || grid[y][x + 1] > 0 && pixel00 > 0 || grid[y + 1][x + 1] > 0 && pixel01 > 0)) {
        hideBrick()
        brick[0][0] = pixel10
        brick[1][0] = pixel11
        brick[1][1] = pixel01
        brick[0][1] = pixel00
        showBrick()
    }
}
function play() {
    brick = bricks[Math.randomRange(1, bricks.length - 1)]
    grid = [[1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1]]
    showBrick()
    x = 3
    y = 0
    frameCount = 0
    score = 0
    alive = true
    while (alive) {
        basic.pause(100 - (score / 2) > 30 ? 100 - (score / 2) : 30)
        frameCount += 1
        if (input.buttonIsPressed(Button.AB)) {
            rotateBrick()
        } else if (input.buttonIsPressed(Button.A)) {
            moveBrick(-1, 0)
        } else if (input.buttonIsPressed(Button.B)) {
            moveBrick(1, 0)
        }
        if (frameCount == 15 && moveBrick(0, 1) == false) {
            frameCount = 0
            grid[y][x] = max(brick[0][0], grid[y][x])
            grid[y][x + 1] = max(brick[0][1], grid[y][x + 1])
            grid[y + 1][x] = max(brick[1][0], grid[y + 1][x])
            grid[y + 1][x + 1] = max(brick[1][1], grid[y + 1][x + 1])
            if (checkLines() == false && y == 0) {
                alive = false
            } else {
                x = 3
                y = 0
                brick = bricks[Math.floor(Math.random() * bricks.length)]
                showBrick()
            }
        }
        if (frameCount == 15) {
            frameCount = 0
        }
    }
    alive = true
    basic.clearScreen()
    basic.showString("GAME OVER. SCORE: " + score, 90)
    if (score > highScore) {
        highScore = score
        basic.showString("A NEW HIGH SCORE!", 80)
    }
    return
}
let highScore = 0
let frameCount = 0
let pixel11 = 0
let pixel10 = 0
let pixel01 = 0
let pixel00 = 0
let alive = false
let bricks: number[][][] = []
let y = 0
let score = 0
let grid: number[][] = []
let brick: any[][] = []
let x = 0
bricks = [
    [[9, 9], [9, 0]],
    [[9, 9], [0, 9]],
    [[9, 9], [9, 9]],
    [[9, 9], [0, 0]],
    [[9, 0], [0, 0]]
]
function max(a: number, b: number): number {

    return a > b ? a : b

}
function moveBrick(delta_x: number, delta_y: number): boolean {

    let move = false

    // check if can move

    if (delta_x == -1 && x > 0) {

        if (!(((grid[y][x - 1] > 0 && brick[0][0] > 0) || (grid[y][x + 1 - 1] > 0 && brick[0][1] > 0) || (grid[y + 1][x - 1] > 0 && brick[1][0] > 0) || (grid[y + 1][x + 1 - 1] > 0 && brick[1][1] > 0)))) {

            move = true

        }

    } else if (delta_x == 1 && x < 5) {

        if (!(((grid[y][x + 1] > 0 && brick[0][0] > 0) || (grid[y][x + 1 + 1] > 0 && brick[0][1] > 0) || (grid[y + 1][x + 1] > 0 && brick[1][0] > 0) || (grid[y + 1][x + 1 + 1] > 0 && brick[1][1] > 0)))) {

            move = true

        }

    } else if (delta_y == 1 && y < 4) {

        if (!(((grid[y + 1][x] > 0 && brick[0][0] > 0) || (grid[y + 1][x + 1] > 0 && brick[0][1] > 0) || (grid[y + 1 + 1][x] > 0 && brick[1][0] > 0) || (grid[y + 1 + 1][x + 1] > 0 && brick[1][1] > 0)))) {

            move = true

        }

    }

    if (move) { // move

        hideBrick()

        x += delta_x

        y += delta_y

        showBrick()

    }



    return move

}
function checkLines(): boolean {

    let removed = false



    for (let i = 0; i < 5; i++) {

        if ((grid[i][1] + grid[i][2] + grid[i][3] + grid[i][4] + grid[i][5]) == 45) {

            removed = true

            score += 10

            for (let j = i; j > 0; j--) grid[j] = grid[j - 1]

            for (let s of [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0, 5, 4, 3, 2, 1, 0]) {
                led.toggle(s, i)
                basic.pause(100 - (score / 2) > 30 ? 100 - (score / 2) : 30)
            }

            for (let j = 0; j < 5; j++) if (!grid[i + 1][j + 1]) {
                grid[i + 1][j + 1] = grid[i][j + 1];
                grid[i][j + 1] = 0;

                for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) setPixel(a, b, grid[b][a + 1])

                basic.pause(200)
            }

            grid[0] = [1, 0, 0, 0, 0, 0, 1]

        }

    }



    if (removed) {

        for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) setPixel(a, b, grid[b][a + 1])

    }



    return removed

}
grid = [[1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1]]
brick = bricks[Math.floor(Math.random() * bricks.length)]
x = 3
alive = true
//showBrick()
while (true) {
    alive = true
    play()
}
