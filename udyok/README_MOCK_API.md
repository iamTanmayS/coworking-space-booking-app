# Mock API Service

This directory contains mock data and services for UI development and testing before backend integration.

## 📁 Files

- **`mockData.ts`** - Contains all mock data (users, spaces, bookings, etc.)
- **`mockApiService.ts`** - Simulates API calls with realistic delays

## 🚀 Quick Start

### 1. Enable Mock Mode

In `mockApiService.ts`:
```typescript
export const USE_MOCK_API = true; // Set to false when backend is ready
```

### 2. Test Credentials

Use these credentials to test the login flow:
- **Email**: `test@udyok.com`
- **Password**: `password123`

### 3. Using Mock Services

```typescript
import { mockAuthService, mockSpacesService } from '@/services/mockApiService';

// Login
const { token, user } = await mockAuthService.login({ email: 'test@udyok.com', password: 'password123' });

// Register
const regResult = await mockAuthService.register({ name: 'Tanmay', email: 'tanmay@example.com', password: 'password123' });

// Get spaces
const { data, total } = await mockSpacesService.getSpaces({ city: 'Mumbai' });

// Get space detail
const space = await mockSpacesService.getSpace('space_001');

// Verify OTP
const result = await mockAuthService.verifyCode('test@udyok.com', '1234');

// Resend OTP
await mockAuthService.resendCode('test@udyok.com');
```

## 📊 Available Mock Data

### Users
- 2 mock users with avatars and profiles
- Current user: John Doe (`user_001`)

### Spaces
- 5 workspace listings with:
  - High-quality images from Unsplash
  - Realistic prices (₹300 - ₹1200)
  - Various amenities
  - Locations in Mumbai and Bangalore

### Bookings
- 4 sample bookings with different statuses:
  - Confirmed
  - Pending
  - Completed
  - Cancelled

### Payment Methods
- Card: `**** **** **** 4242`
- UPI: `john.doe@paytm`
- Wallet: `Udyok Wallet`

### Transactions
- 4 transaction records (credit/debit)
- Wallet balance calculation

### Chats
- 3 chat conversations
- Multiple messages per chat
- Unread count tracking

### Settings
- Theme, notifications, language preferences
- Email/SMS notification toggles

### Favorites
- 3 pre-favorited spaces

## 🔧 Helper Functions

### Filter Spaces
```typescript
import { getFilteredSpaces } from '@/services/mockData';

const spaces = getFilteredSpaces({
  location: 'Mumbai',
  minPrice: 500,
  maxPrice: 1000,
  amenities: ['WiFi', 'Projector']
});
```

### Search Spaces
```typescript
import { searchSpaces } from '@/services/mockData';

const results = searchSpaces('conference');
```

### Filter Bookings
```typescript
import { getFilteredBookings } from '@/services/mockData';

const confirmed = getFilteredBookings({ status: 'confirmed' });
```

## ⚙️ Configuration

### Adjust Network Delay
In `mockApiService.ts`:
```typescript
const MOCK_DELAY = 800; // Milliseconds
```

Set to `0` for instant responses or increase to simulate slow networks.

## 🔄 Switching to Real API

When your backend is ready:

1. Set `USE_MOCK_API = false` in `mockApiService.ts`
2. Update the `EXPO_PUBLIC_API_URL` in your `.env` file
3. All RTK Query hooks will automatically use the real API

## 📝 Adding More Mock Data

To add new mock data:

1. **Add to `mockData.ts`**:
```typescript
export const mockNewFeature = [
  { id: '1', name: 'Example' },
  // ... more items
];
```

2. **Add service in `mockApiService.ts`**:
```typescript
export const mockNewFeatureService = {
  async getItems() {
    await delay(MOCK_DELAY);
    return mockNewFeature;
  },
};
```

## 🎨 UI Development Tips

1. **Use realistic data** - The mock data includes real images and proper formatting
2. **Test edge cases** - Add items with long names, missing fields, etc.
3. **Simulate errors** - Modify services to throw errors for testing error states
4. **Test loading states** - Adjust `MOCK_DELAY` to see loading spinners

## 🧪 Testing Scenarios

### Empty States
```typescript
// In mockData.ts, temporarily set:
export const mockSpaces: Space[] = [];
```

### Error States
```typescript
// In mockApiService.ts:
async getSpaces() {
  await delay(MOCK_DELAY);
  throw new Error('Network error');
}
```

### Slow Network
```typescript
const MOCK_DELAY = 3000; // 3 seconds
```

## 📱 Example Usage in Components

```typescript
import { useGetSpacesQuery } from '@/features/spaces/spaces.api';

function SpacesList() {
  const { data, isLoading, error } = useGetSpacesQuery({
    location: 'Mumbai',
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <FlatList
      data={data?.spaces}
      renderItem={({ item }) => <SpaceCard space={item} />}
    />
  );
}
```

The RTK Query hook will automatically use mock data when `USE_MOCK_API` is true!

## 🎯 Benefits

✅ **Develop UI independently** - No need to wait for backend
✅ **Consistent data** - Same data across team members
✅ **Fast iteration** - No network delays during development
✅ **Easy testing** - Predictable data for screenshots and demos
✅ **Offline development** - Work anywhere without internet

---

Happy coding! 🚀
