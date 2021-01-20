import express from 'express'
import { checkHealth, shortenUrl, getOriginalUrl } from './handlers'


const router = express.Router()

router.get("/internal/health", checkHealth)

router.post("/shorten", shortenUrl)
router.get("/:id", getOriginalUrl)

export { router }
