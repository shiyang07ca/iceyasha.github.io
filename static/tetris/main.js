class TetrisRect {
    constructor(ctx, x, y, width, height, color) {
        this.ctx = ctx
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.moved = true

        this.ctx.strokeStyle = 'black'
        this.ctx.strokeRect(x, y, this.width, this.height)

    }
    static new(...args) {
        let i = new this(...args)
        return i
    }

    static remove(ctx, x, y, width, height) {
        // log(x - 1, y - 1, width + 2, height + 2)
        ctx.clearRect(x - 1, y - 1, width + 2, height + 2)
    }

    static draw(ctx, x, y, width, height) {
        // ctx.strokeStyle = 'black'
        // ctx.strokeRect(x, y, width, height)
        // this.new(ctx, (pos[0] + block[0]) * SIZE + 3, (pos[1] + block[1]) * SIZE + 3, SIZE, SIZE)
    }
}

class Piece {
    constructor(ctx, pointArray, position, board) {
        this.allRotations = pointArray
        this.position = position
        this.ctx = ctx

        return
    }

    static new(...args) {
        let i = new this(...args)
        return i
    }

    move(dx, dy) {
        this.position = [this.position[0] + dx, this.position[1] + dy]
    }

    draw() {
        const blocks = this.allRotations
        const pos = this.position
        const SIZE = 20
        for (let i = 0; i < blocks[3].length; i++) {
            let block = blocks[3][i]
            TetrisRect.new(this.ctx, (pos[0] + block[0]) * SIZE + 3, (pos[1] + block[1]) * SIZE + 3, SIZE, SIZE)
        }
        // block is not definned????
        // for (block of blocks[0]) {
        //     // log('block', block, (pos[0] + block[0]) * SIZE + 3, (pos[1] + block[1]) * SIZE + 3, SIZE, SIZE)
        //     TetrisRect.new(this.ctx, (pos[0] + block[0]) * SIZE + 3, (pos[1] + block[1]) * SIZE + 3, SIZE, SIZE)
        // }
    }

    clear() {
        const blocks = this.allRotations
        const pos = this.position
        const SIZE = 20
        // log('bs', blocks[1])
        for (let i = 0; i < blocks[3].length; i++) {
            let block = blocks[3][i]
            TetrisRect.remove(this.ctx, (pos[0] + block[0]) * SIZE + 3, (pos[1] + block[1]) * SIZE + 3, SIZE, SIZE)
        }
    }

    update(dx, dy) {
        this.clear()

        this.move(dx, dy)

        this.draw()
    }
}

class Board {
    constructor() {

    }
}

const __main = function() {
    const canvas = document.getElementById("id-canvas");
    const ctx = canvas.getContext("2d");
    // const rect = TetrisRect.new(canvas, 10, 10, 20, 20)

    const pointArray = [
        // 田
        [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1]
        ],
        // 一
        [
            [-1, 0],
            [0, 0],
            [1, 0],
            [2, 0]
        ],
        // T
        [
            [-1, 0],
            [0, 0],
            [1, 0],
            [0, 1],
            [0, 2]
        ],
        // L
        [
            [0, -1],
            [0, 0],
            [0, 1],
            [1, 1]
        ]
    ]
    const position = [2, 2]
    const piece = Piece.new(ctx, pointArray, position)

    window.addEventListener('keydown', event => {
        log('e', event.key)
        if (event.key === 'a') {
            log('左')
            piece.update(-1, 0)
        } else if (event.key === 'd') {
            log('右')
            piece.update(1, 0)
        }
    })

    setInterval(() => {
        // piece.move(0, 1)
        piece.update(0, 1)
        // drawPiece(ctx, piece)
    }, 200)

};

__main();
