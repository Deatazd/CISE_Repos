import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable"; // 确保路径正确

interface ArticlesInterface {
    id: string;
    title: string;
    authors: string;
    source: string;
    pubyear: string;
    doi: string;
    claim: string;
    evidence: string;
}

type ArticlesProps = {
    articles: ArticlesInterface[];
};

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
    const headers = [
        { key: "title", label: "Title" },
        { key: "authors", label: "Authors" },
        { key: "source", label: "Source" },
        { key: "pubyear", label: "Publication Year" },
        { key: "doi", label: "DOI" },
        { key: "claim", label: "Claim" },
        { key: "evidence", label: "Evidence" },
    ];

    return (
        <div className="container">
            <h1>Articles Index Page</h1>
            <p>Page containing a table of articles:</p>
            <SortableTable headers={headers} data={articles} />
        </div>
    );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async () => {
    // 使用环境变量来构建 API 请求的 URL
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`);

    if (!res.ok) {
        // 如果请求失败，抛出错误并在控制台中显示状态码
        throw new Error(`Failed to fetch articles, status: ${res.status}`);
    }

    const articles: ArticlesInterface[] = await res.json();

    return {
        props: {
            articles,
        },
        revalidate: 60, // 每 60 秒重新验证数据
    };
};

export default Articles;
