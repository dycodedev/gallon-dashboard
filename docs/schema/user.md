
# User

## Schema

```
{
    username: 'john',
    email: 'john@email.com',
    fullname: 'John Wick',
    state: 'verified',
    profilePicture: 'https://user/profile/picture',
    coverPicture: 'https://user/cover/picture',
    accounts: [ 
        {
            provider: 'facebook',
            id: 1111,
            // other data
        },
        {
            provider: 'twitter',
            id: 1234,
            // other data
        }
    ]
}
```