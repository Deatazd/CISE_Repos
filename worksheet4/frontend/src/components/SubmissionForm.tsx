import React from "react";
import { useForm } from "react-hook-form";

interface ArticleData {
    title: string;
    authors: string[];
    source: string;
    pubyear: number;
    doi: string;
    claim: string;
    evidence: string;
}


export default function SubmissionForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<ArticleData>();

    const onSubmit = async (data: ArticleData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("Success:", responseData);
            alert('Article submitted successfully!');
        } catch (error) {
            console.error("Error submitting article:", error);
            alert(`Failed to submit article: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("title", { required: true })} placeholder="Title" />
            {errors.title && <span>{errors.title.message}</span>}

            {/* Handle multiple authors */}
            <div>
                <label>Authors:</label>
                {["", "", "", ""].map((_, index) => (
                    <input key={index} {...register(`authors.${index}`, { required: true })} placeholder={`Author ${index + 1}`} />
                ))}
            </div>

            <input {...register("source", { required: true })} placeholder="Source" />
            <input type="number" {...register("pubyear", { required: true, valueAsNumber: true })} placeholder="Publication Year" />
            <input {...register("doi", { required: true })} placeholder="DOI" />

            <input {...register("claim", { required: true })} placeholder="Claim" />
            <input {...register("evidence", { required: true })} placeholder="Evidence" />

            <button type="submit">Submit</button>
        </form>
    );
}
