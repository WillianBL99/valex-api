<p align="center">
  <a href="https://https://github.com/WillianBL99/valex-api">
    <img src="https://user-images.githubusercontent.com/65803142/178558586-30f6d8fa-7ca5-451b-9f55-688eed0667a5.png" alt="readme-logo" width="180" >
  </a>

  <h3 align="center">
    Valex API
  </h3>
</p>

## Usage

```bash
$ git clone https://https://github.com/WillianBL99/valex-api

$ cd valex-api

$ npm install

$ npm run dev
```

## API:
---
## Entites 
- [card](#credit_card-card) 
- [payment](#money_with_wings-payment) 
- [recharge](#moneybag-recharge)


## :credit_card: Card
### POST /card/create
```
  - route to create a card
  - header: {'x-api-key': '$somekey'}
  - body: { 
      type: 'groceries' | 'restaurants' | 'transport' | 'education' | 'health',
      cpf: '$00011122233'
    }
  - status: 201
  - response data: 
```  
```json
    {}
```

### POST /card/:id/active
```
  - route to active a card
  - header: {}
  - body: { 
      cvv: '$555',
      password: '$1234'
    }
  - status: 200
  - response data: 
```  
```json
    {}
```

### GET /card/:id/trasaction
```
  - route to show banlance and transactions
  - header: {}
  - body: {}
  - status: 200
  - response data: 
```  
```json
    {
      "trasactionAndBalanceData": {
        "balance": "154950",
        "transactions": [
          {
            "id": $4,
            "cardId": $10,
            "businessId": $5,
            "timestamp": "$2022-07-12T18:43:07.050Z",
            "amount": $50,
            "businessName": "$Unimed"
          }
        ],
        "recharges": [
          {
            "id": $4,
            "cardId": $10,
            "timestamp": "$2022-07-12T18:41:24.366Z",
            "amount": $55000
          }
        ]
      }
    }
```

### POST /card/info
```
  - route to show employee cards
  - header: {}
  - body: { 
      employId: $1
      password: $1234
    }
  - status: 200
  - response data: 
```
```json
   {
     "cards": [{
      "number": "$5595559555955595",
      "cardholderName": "$FULANO N SILVA",
      "expirationDate": "$04/30",
      "securityCode": "$555"
     }]
    }
```

### POST /card/block/:id
```
  - route to block a card
  - header: {}
  - body: {
      password: '$1234'
    }
  - status: 200
  - response data: 
```  
```json
    {}
```

### POST /card/unlock/:id
```
  - route to unlock a card
  - header: {}
  - body: {
      password: '$1234'
    }
  - status: 200
  - response data: 
```  
```json
    {}
```

---
[:outbox_tray:](#----valex-api--)
## :money_with_wings: Payment

### POST /payment/:cardId
```
  - route to make a payment
  - header: {}
  - body: {
      cvv: "$555",
      amount: "$10000",
      password: "$1234",
      businessId: "$1"
    }
  - status: 200
  - response data: 
```  
```json
    {}
```

---
[:outbox_tray:](#----valex-api--)
## :moneybag: Recharge

### POST /recharge/:cardId
```
  - route to make a recharge
  - header: {'x-api-key': '$somekey'}
  - body: {
      amount: '$10000'
    }
  - status: 200
  - response data: 
```  
```json
    {}
```

---
Desenvolvido por **Paulo Uilian Barros Lago**😊🧑🏻‍💻
