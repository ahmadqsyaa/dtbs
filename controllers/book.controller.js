const postgre = require('../database')
const bookController = {
    getAll: async(req, res) => {
        try {
            const { rows } = await postgre.query("select * from books")
            res.json({msg: "OK", data: rows})
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    getById: async(req, res) => {
        try {
            const { rows } = await postgre.query("select * from books where book_id = $1", [req.params.id])

            if (rows[0]) {
                return res.json({msg: "OK", data: rows})
            }

            res.status(404).json({msg: "Tidak Ditemukan"})
        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    create: async(req, res) => {
        try {
            const { name, prices } = req.body

            const sql = 'INSERT INTO books(name, prices) VALUES($1, $2) RETURNING *'

            const { rows } = await postgre.query(sql, [name, prices])

            res.json({msg: "OK", data: rows[0]})

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    updateById: async(req, res) => {
        try {
            const { name, prices } = req.body

            const sql = 'UPDATE books set name = $1, prices = $2 where book_id = $3 RETURNING *'

            const { rows } = await postgre.query(sql, [name, prices, req.params.id])

            res.json({msg: "OK", data: rows[0]})

        } catch (error) {
            res.json({msg: error.msg})
        }
    },
    deleteById: async(req, res) => {
        try {
            const sql = 'DELETE FROM books where book_id = $1 RETURNING *'

            const { rows } = await postgre.query(sql, [req.params.id])

            if (rows[0]) {
                return res.json({msg: "OK", data: rows[0]})
            }

            return res.status(404).json({msg: "Tidak Ditemukan"})
            

        } catch (error) {
            res.json({msg: error.msg})
        }
    }
}

module.exports = bookController
