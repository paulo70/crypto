import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './detail.module.css'

interface DetailsProps{
    symbol: string;
    name: string;
    price: string;
    market_cap: string;
    low_24h: string;
    high_24h: string;
    total_volume_24h: string;
    delta_24h: string;
    formatedPrice: string;
    formatedMarket: string;
    formatedLowprice: string;
    formatedHighprice: string;
    formatedDelta?: number;
    error?: string;
}

export function Detail(){
    const {cripto} = useParams()
    const [detailCoins, setDetailCoins] = useState<DetailsProps>()
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        fetch(`https://sujeitoprogramador.com/api-cripto/coin/?key=ab6b1ff55eb825d5&symbol=${cripto}`)
        .then(response => response.json())
        .then((data:DetailsProps) => {
            let price = Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
            })

            if(data.error){
                navigate("/")
            }

            const resultDetail = {
                ...data,
                formatedPrice: price.format(Number(data.price)),
                formatedMarket: price.format(Number(data.market_cap)),
                formatedLowprice: price.format(Number(data.low_24h)),
                formatedHighprice: price.format(Number(data.high_24h)),
                formatedDelta: parseFloat(data.delta_24h.replace(",", "."))
            }
      
            setDetailCoins(resultDetail)
            setLoading(false)
        })
    }, [cripto])

    if(loading){
        return(
            <div className={styles.container}>
                <h3 className={styles.title}>Loading info ....</h3>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h2>Detail {cripto}</h2>
            <h3>Name: {detailCoins?.name}</h3>
            <h4>Symbol: {detailCoins?.symbol}</h4>
            <section>
                <p>Price: {detailCoins?.formatedPrice}</p>
                <p>Bigger then 24: {detailCoins?.formatedHighprice}</p>
                <p>Less Than 24: {detailCoins?.formatedLowprice}</p>
                <p>
                   <strong>Delta 24: </strong> 
                   <span className={ detailCoins?.formatedDelta && detailCoins?.formatedDelta >= 0 ? styles.profit : styles.loss}>
                      {detailCoins?.delta_24h}
                   </span>
                </p>
                <p>Value Market: {detailCoins?.formatedMarket}</p>
            </section>
        </div>
    )
}