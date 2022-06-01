import { useParams } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
    const id = params.story;
    return json({
        stories: {id}
      });
}


export default function Story() {
    const params = useParams();
    const id = params.story;

    return <div>
        { id } hey i am cool
    </div>
}