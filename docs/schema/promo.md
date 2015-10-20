
# Promo

## Schema

```
{
    _id: 'ID',
    description: 'Diskon 20% bagi pengguna kartu kredit Mandiri',
    card: 'cc', // or debit
    bank: 'Mandiri',
    discount: {
        kind: 'percent', // or nominal
        value: '20'
    },
    valid: {
        from: Date,
        to: Date
    },
    active: true
}
```

Promo attached to a Venue, so when we GET for venue detail, we will query associated active promo (`active: true` and within valid date)

