| Frontend | Backend       | DB        | AI/LLM          |
|----------|---------------|-----------|-----------------|
| React.js | Node.js (Express) | Supabase (PostgreSQL) | Google Gemini (via API key) |


- Create, edit, and delete personal to-do items.
- Generate a summary of all pending to-dos using Google Gemini (LLM).




| Method | Endpoint     | Description                       |
| ------ | ------------ | --------------------------------- |
| GET    | `/todos`     | Fetch all todos                   |
| POST   | `/todos`     | Create a new todo                 |
| PUT    | `/todos/:id` | Update an existing todo           |
| DELETE | `/todos/:id` | Delete a todo                     |
| POST   | `/summarize` | Generate summary using Gemini LLM |
