class Rect {
    constructor(ctx, x, y, width, height, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.moved = true;

        // this.ctx.fillStyle = "red";
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.width, this.height);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(x, y, this.width, this.height);
    }

    static new(...args) {
        this.i = new this(...args);
        return this.i;
    }
}

class Piece {
    constructor(pointArray, position, board) {
        this.allRotations = pointArray;
        this.position = position;
        this.board = board;
        this.moving = true;
    }

    static new(...args) {
        this.i = new this(...args);
        return this.i;
    }

    static nextPiece(board) {
        // log("Piece nextPiece", this.allRotations);
        log('call next')
        const pos = [2, 0];
        const piece = Piece.new(Piece.allRotations, pos, board);
        return piece
    }

    move(dx, dy) {
        const blocks = this.allRotations;
        for (let i = 0; i < blocks[2].length; i++) {
            const block = blocks[2][i];
            const column = this.position[0] + block[0];
            const row = this.position[1] + block[1];
            if (row >= this.board.numRow - 1) {
                this.moving = false;
                // log('this.moving', this.moving)
                return;
            }

            if (
                (dx > 0 && column >= this.board.numColumn - 1) ||
                (dx < 0 && column <= 0)
            ) {
                dx = 0;
            }
        }
        // TODO 模块划分不合理, 待重构
        this.clearGridPiece()
        this.position = [this.position[0] + dx, this.position[1] + dy];
        this.setGridPiece()
    }

    clearGridPiece() {
        const blocks = this.allRotations;
        for (let i = 0; i < blocks[2].length; i++) {
            const block = blocks[2][i];
            const column = this.position[0] + block[0];
            const row = this.position[1] + block[1];
            this.board.grid[row][column] = 0;
        }
    }

    setGridPiece() {
        const blocks = this.allRotations;
        for (let i = 0; i < blocks[2].length; i++) {
            const block = blocks[2][i];
            const column = this.position[0] + block[0];
            const row = this.position[1] + block[1];
            this.board.grid[row][column] = 1;
        }
    }

    update(dx, dy) {
        if (this.moving) {
            this.move(dx, dy);
            this.board.currentPiece = this
        } else {
            this.moving = false;
            this.board.currentPiece = Piece.nextPiece(this.board)
        }
    }

    static allRotations = [
        // 田
        [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1]
        ],
        // 一
        [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0]
        ],
        // T
        [
            [0, 0],
            [1, 0],
            [2, 0],
            [1, 1],
            [1, 2]
        ],
        // L
        [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 2]
        ]
    ];
}

class Board {
    constructor() {
        // 设置常量
        this.blockSize = 15;
        this.numColumn = 20;
        this.numRow = 28;
        this.canvas = null;
        this.ctx = null;
        this.grid = [...Array(this.numRow)].map(x => Array(this.numColumn).fill(0))
        this.setBoard();
        // this.currentPiece = Piece.nextPiece(this);
        // log("board currentPiece", this.currentPiece);
        log("board: ", this.grid);
    }

    static new(...args) {
        this.i = this.i || new this(...args);
        return this.i;
    }

    drawBoard() {
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const [indexY, row] of this.grid.entries()) {
            for (const [indexX, block] of row.entries()) {
                if (block === 1) {
                    const x = indexX * this.blockSize;
                    const y = indexY * this.blockSize;
                    Rect.new(this.ctx, x, y, this.blockSize, this.blockSize, 'red');
                } else {
                    const x = indexX * this.blockSize;
                    const y = indexY * this.blockSize;
                    Rect.new(this.ctx, x, y, this.blockSize, this.blockSize, 'white');
                }
            }
        }
    }

    setBoard() {
        const width = this.blockSize * this.numColumn;
        const height = this.blockSize * this.numRow;
        const canvasStr = `<canvas id="id-canvas" width="${width}" height="${height}"></canvas>`;
        const ele = e(".canvas");
        ele.insertAdjacentHTML("beforeend", canvasStr);
        const canvas = e("#id-canvas");
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        // log("canvas: ", canvas);
    }
}

class Game {
    constructor() {
        // TODO 初始化board时传入game配置参数(格子长宽个数等)
        this.board = Board.new();
        this.running = true;
        this.currentPiece = Piece.nextPiece(this.board);
    }

    static new(...args) {
        this.i = this.i || new this(...args);
        return this.i;
    }

    static bindEvent(currentPiece) {
        window.addEventListener("keydown", event => {
            log("e", event.key);
            if (event.key === "a") {
                log("左");
                currentPiece.update(-1, 0);
            } else if (event.key === "d") {
                log("右");
                currentPiece.update(1, 0);
            }
        });
    }

    run() {
        // Game.bindEvent(this.board.currentPiece);
        setInterval(() => {
            // let currentPiece = this.board.currentPiece;
            // this.currentPiece = Piece.nextPiece(this.board);
            let currentPiece = this.currentPiece;
            // log("board currentPiece", currentPiece);
            currentPiece.update(0, 1);
            this.board.drawBoard();
        }, 100);
    }
}

const __main = () => {
    const game = Game.new();
    game.run();
    log(`================ GAME START ================`);
    log("game: ", game);
};

__main();
