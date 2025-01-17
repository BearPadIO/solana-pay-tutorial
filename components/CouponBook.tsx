import { getAssociatedTokenAddress, getAccount, TokenAccountNotFoundError } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useState, useEffect } from "react"
import { couponAddress } from "../lib/addresses"

export default function CouponBook() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [couponBalance, setCouponBalance] = useState(0)


  async function getCouponBalance() {
    if (!publicKey) {
      setCouponBalance(0)
      return
    }

    try {
      const userCouponAddress = await getAssociatedTokenAddress(couponAddress, publicKey)
      const userCouponAccount = await getAccount(connection, userCouponAddress)
      const coupons = userCouponAccount.amount > 5 ? 5 : Number(userCouponAccount.amount)

      console.log("balance is", coupons)
      setCouponBalance(coupons)
    } catch (e) {
      if (e instanceof TokenAccountNotFoundError) {
        // This is ok, the API will create one when they make a payment
        console.log(`User ${publicKey} doesn't have a coupon account yet!`)
        setCouponBalance(0)
      } else {
        console.error('Error getting coupon balance', e)
      }
    }
  }

  useEffect(() => {
    getCouponBalance()
  }, [publicKey])

  const notCollected = 5 - couponBalance

  
}