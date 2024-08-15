import React, { useState } from "react";
import formStyles from "../../styles/Form.module.scss";

interface ArticleData {
    title: string;
    authors: string[];
    source: string;
    publication_year: number;
    doi: string;
    summary: string;
    linked_discussion?: string;
    claim: string;
    evidence: string;
}

const NewDiscussion = () => {
    const [articleData, setArticleData] = useState<ArticleData>({
        title: "",
        authors: [""],
        source: "",
        publication_year: 0,
        doi: "",
        summary: "",
        linked_discussion: "",
        claim: "",
        evidence: ""
    });

    const submitNewArticle = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Submitting:", JSON.stringify(articleData));  // 在提交前在控制台查看数据

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Success:", result);
            alert('Article submitted successfully!');
        } catch (error) {
            console.error("Error submitting article:", error);
            alert(`Failed to submit article: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    };

    const handleChange = (name: keyof ArticleData, value: any, index?: number) => {
        setArticleData(prev => {
            if (typeof index === 'number') {
                const newAuthors = [...prev.authors];
                newAuthors[index] = value;
                return { ...prev, authors: newAuthors };
            }
            return { ...prev, [name]: value };
        });
    };

    const addAuthor = () => {
        setArticleData(prev => ({ ...prev, authors: [...prev.authors, ""] }));
    };

    const removeAuthor = (index: number) => {
        setArticleData(prev => ({
            ...prev,
            authors: prev.authors.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="container">
            <h1>New Article</h1>
            <form className={formStyles.form} onSubmit={submitNewArticle}>
                <label htmlFor="title">Title:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    id="title"
                    value={articleData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                />

                <label htmlFor="author">Authors:</label>
                {articleData.authors.map((author, index) => (
                    <div key={index} className={formStyles.arrayItem}>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => handleChange("authors", e.target.value, index)}
                            className={formStyles.formItem}
                        />
                        <button
                            onClick={() => removeAuthor(index)}
                            className={formStyles.buttonItem}
                            type="button"
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    onClick={addAuthor}
                    className={formStyles.buttonItem}
                    type="button"
                >
                    +
                </button>

                <label htmlFor="source">Source:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    id="source"
                    value={articleData.source}
                    onChange={(e) => handleChange("source", e.target.value)}
                />

                <label htmlFor="pubYear">Publication Year:</label>
                <input
                    className={formStyles.formItem}
                    type="number"
                    id="pubYear"
                    value={articleData.publication_year || ""}
                    onChange={(e) => handleChange("publication_year", parseInt(e.target.value) || 0)}
                />

                <label htmlFor="doi">DOI:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    id="doi"
                    value={articleData.doi}
                    onChange={(e) => handleChange("doi", e.target.value)}
                />

                <label htmlFor="summary">Summary:</label>
                <textarea
                    className={formStyles.formTextArea}
                    id="summary"
                    value={articleData.summary}
                    onChange={(e) => handleChange("summary", e.target.value)}
                />

                {/* 添加 Claim 字段 */}
                <label htmlFor="claim">Claim:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    id="claim"
                    value={articleData.claim}
                    onChange={(e) => handleChange("claim", e.target.value)}
                />

                {/* 添加 Evidence 字段 */}
                <label htmlFor="evidence">Evidence:</label>
                <input
                    className={formStyles.formItem}
                    type="text"
                    id="evidence"
                    value={articleData.evidence}
                    onChange={(e) => handleChange("evidence", e.target.value)}
                />

                <button className={formStyles.formItem} type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default NewDiscussion;
