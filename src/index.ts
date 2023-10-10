import express, { Request, Response } from 'express';
import cors from 'cors'
import { db } from './database/knex';

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Prática 1

app.get('/bands', async (req: Request, res: Response) => {
    try{

        const result = await db.raw(`SELECT * FROM bands`)

        res.status(200).send(result)

    } catch (error: any) {

        // erro padrão

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Prática 2

app.post('/bands', async (req: Request, res: Response) => {
    try{

        const {id, name} = req.body

        // verificação padrão

        if (!id || !name) {
            res.status(400)
            throw new Error('id ou name invalidos')
        }

        await db.raw(
            `INSERT INTO bands
            VALUES('${id}', '${name}')`)
            // recebendo os valores pelo body

        res.status(200).send('Banda cadastrada com sucesso!')

    } catch (error: any) {

        // erro padrão

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Prática 3

app.put('/bands/:id', async (req: Request, res: Response) => {
    try{

        const id = req.params.id
        
        const newId = req.body.newId
        const newName = req.body.newName

        // verificação

        if (newId !== undefined) {
            if (typeof newId !== 'string') {
                res.status(400)
                throw new Error('Id deve ser uma string')
            }
            if (newId.length !== 4) {
                throw new Error('Id precisa ter 4 caracteres')
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== 'string') {
                res.status(400)
                throw new Error('Name deve ser uma string')
            }
            if (newName.length < 2) {
                throw new Error('Name precisa ter ao menos 2 caracteres')
            }
        }

        const [attBand] = await db.raw(`SELECT * FROM bands WHERE id = "${id}"`)

        if(attBand) { // este if verifica se o id existe na tabela
            await db.raw(`
                UPDATE bands SET
                id = "${newId || attBand.id}", 
                name = "${newName || attBand.name}"
                WHERE id = "${id}"
                `)
        } else {
            res.status(400)
            throw new Error('ID não encontrado')
        }

        res.status(200).send('Banda atualizada com sucesso!')

    } catch (error: any) {

        // erro padrão

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


