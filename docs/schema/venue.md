
# Venue

We aim for more generic venue descriptors

## Schema

```
{
    _id: 'ID',
    type: 'restaurant',
    name: 'Great Food Hall',
    slug: 'greatfoodhall',
    description: 'A european medieval themed restaurant with old middle age like food',
    location: {
        type: 'Point',
        coordinate: [2.1, 1.2]
    },
    address: 'Jln. Bandung Raya No. 12',
    place:
        provider: 'google',
        // other data from google here, we can also use foursquare or other place API 
    },
    tags: ['medieval','local','european','themed','beef','steak','fruit'],
    categories: [
        {
            // List of categories reference
        }
    ],
    photos: [
        {
            caption: 'exterior',
            url: 'https://this/is/venue/exterior/photo'
        },
        ...
    ],
    links: [
        {
            type: 'website',
            url: 'https://greatfoodhall.com'
        },
        {
            type: 'facebook',
            url: 'https://facebook.com/greatfoodhall'
        },
        ...
    ],
    contacts: [
        {
            type: 'phone',
            value: '+6222123456'
        },
        {
            type: 'twitter',
            value: '@greatfoodhall'
        },
        ...
    ],
    url: 'https://happygasm.com/venue/greatfoodhall',
    stats: {
        likes: 20
    },

    // external refs
    promos: [
        {
            // list of active promos
        },
    ]
}
```

## External references

* Promo

