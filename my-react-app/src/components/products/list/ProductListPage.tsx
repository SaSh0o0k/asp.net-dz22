import {Button, Col, Flex, Pagination, Row} from "antd";
import {useEffect, useState} from "react";
import {IProductData, IProductSearch} from "../../../interfaces/products/index.ts";
import {ICategoryName} from "../../../interfaces/categories";
import http_common from "../../../http_common.ts";
import ProductCard from "./ProductCard.tsx";
import {Link, useSearchParams} from "react-router-dom";
import SiteSearch from "../../SiteSearch";

const ProductListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search , setSearch] = useState<string>('');

    const [formParams, setFormParams] = useState<IProductSearch>({
        categoryId: Number(searchParams.get('categoryId')) || undefined,
        name: searchParams.get('name') || undefined,
        description: searchParams.get('description') || undefined,
        page: Number(searchParams.get('page')) || 1,
        pageSize: Number(searchParams.get('pageSize')) || 1
    });

    const [data, setData] = useState<IProductData>({
        list: [],
        pageSize: formParams.pageSize,
        totalPages: 0,
        pageIndex: formParams.page,
        totalCount: 0
    });

    // @ts-expect-error
    const [categories, setCategories] = useState<ICategoryName[]>([]);

    useEffect(() => {
        http_common.get<ICategoryName[]>("/api/categories/names")
            .then(resp=> {
                console.log("list categories", resp.data);
                setCategories(resp.data);
            });
    }, []);

    useEffect(() => {
        updateSearchParams(formParams);
        http_common.get<IProductData>("/api/products",
            {
                params: formParams
            })
            .then(resp=> {
                console.log("Get products", resp.data);
                setData((resp.data));
            });
    }, [formParams]);


    // пошук
    useEffect(() => {
        updateSearchParams(formParams);
        fetchProducts();
    }, [formParams]);

    useEffect(() => {
        setFormParams(prevState => ({
            ...prevState,
            name: search
        }));
    }, [search]);

    const fetchProducts = () => {
        http_common.get<IProductData>("/api/products", {
            params: formParams
        })
            .then(resp => {
                console.log("Get products", resp.data);
                setData(resp.data);
            });
    };
    // кінець пошуку

    const handlePageChange = (page: number, newPageSize: number) => {
        setFormParams({...formParams, page, pageSize: newPageSize});
    };

    const updateSearchParams = (params : IProductSearch) =>{
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== 0) {
                searchParams.set(key, value);
            } else {
                searchParams.delete(key);
            }
        }
        setSearchParams(searchParams);
    };

    // @ts-expect-error
    const {list, totalPages, pageSize, pageIndex, totalCount } = data;
    return (
        <>
            <h1>Список продуктів</h1>

            <Link to={"/products/create"}>
                <Button type="primary">
                    Додати
                </Button>
            </Link>

            <Flex gap="20px">
                <SiteSearch search = {search} setSearch = {setSearch}/>
            </Flex>

            <Row gutter={16}>
                <Col span={24}>
                    <Row>
                        {list.length === 0 ? (
                            <h2>Список пустий</h2>
                        ) : (
                            list.map((item) =>
                                <ProductCard key={item.id} {...item} />,
                            )
                        )}
                    </Row>
                </Col>
            </Row>

            <Row style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <Pagination
                    showTotal={(total, range) => `${range[0]}-${range[1]} із ${total} записів`}
                    current={pageIndex}
                    defaultPageSize={pageSize}
                    total={totalCount}
                    onChange={handlePageChange}
                    pageSizeOptions={[1, 2, 5, 10]}
                    showSizeChanger
                />
            </Row>

        </>
    );
}

export default ProductListPage;