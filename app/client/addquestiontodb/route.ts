import { supabase } from "@/supabase";
import { Database } from "@/database.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const question = searchParams.get("question");
  const questionanswer = searchParams.get("questionanswer");
  const exam = searchParams.get("exam");
  const user_id = searchParams.get("user_id"); // ← added

  // ❌ Missing required fields
  if (!question || !questionanswer || !exam || !user_id) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const newQuestion: Database["public"]["Tables"]["question"]["Insert"] = {
      question_text: question,
      answer: questionanswer,
      exam,
      user_id,            // ← added
    }

  // 🧾 Insert into DB
  const { data, error } = await supabase
    .from("question")
    .insert(newQuestion)
    .select();

  // ❌ Database error
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 🎉 Success
  return new Response(JSON.stringify({ data }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
