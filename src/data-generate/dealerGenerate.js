import helpers from "../helpers"

export default async () => {
  await helpers.dealer.create({
    input: {
      ban: "53117492",
      name: "經銷商A",
      owner: "A",
      email: "dealera@dealer.com",
      address: "DealerA地址",
      phoneNumber: "0912345678",
      profitPercentSetting: 30,
      contractUrl: "dealersContract/test01/4idps.jpeg"
    }
  })

  await helpers.dealer.create({
    input: {
      ban: "53117492",
      name: "經銷商B",
      owner: "B",
      email: "dealerb@dealer.com",
      address: "DealerB地址",
      phoneNumber: "0912345666",
      profitPercentSetting: 20,
      contractUrl: "dealersContract/test02/4idps.jpeg"
    }
  })
}
