import { Client } from "@notionhq/client"
import dotenv from "dotenv"

dotenv.config()
const NOTION_KEY = process.env.NOTION_API_KEY

const notion = new Client({ auth: NOTION_KEY })

export default notion