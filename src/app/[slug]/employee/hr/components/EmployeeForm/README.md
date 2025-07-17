# Employee Form Components

This directory contains the refactored employee form components, breaking down the original large `EmployeeForm.tsx` (1041 lines) into smaller, more manageable and reusable components.

## Component Structure

### Main Components

- **`EmployeeFormRefactored.tsx`** - Main form component that orchestrates all other components
- **`EmployeeForm.tsx`** - Backward compatibility wrapper (updated to use refactored version)

### Form Sections

- **`PersonalInformationSection.tsx`** - Handles personal information fields (name, contact, nationality, religion, etc.)
- **`JobInformationSection.tsx`** - Handles job-related fields (email, password, salary, role, department, etc.)
- **`BankInformationSection.tsx`** - Handles banking information fields (bank name, account number, IFSC, PAN, etc.)

### UI Components

- **`FormHeader.tsx`** - Form title and expand/collapse all sections functionality
- **`FormSectionHeader.tsx`** - Collapsible section headers with toggle functionality
- **`FormField.tsx`** - Reusable form field component with validation and error handling
- **`RequiredLabel.tsx`** - Label component for required fields with asterisk
- **`ImageUploadCard.tsx`** - Image upload functionality for profile picture, address proof, and utility bill
- **`FormActions.tsx`** - Form submission buttons and actions (clear form, cancel changes)

### Utilities

- **`types.ts`** - Component-specific TypeScript interfaces (extends existing EmployeeFormData with form-specific fields)
- **`utils.ts`** - Helper functions, constants, and validation logic
- **`index.ts`** - Export file for easy importing

## Usage

### Basic Usage

```tsx
import { EmployeeFormRefactored } from './EmployeeForm';

// Add new employee
<EmployeeFormRefactored mode="add" />

// Edit existing employee
<EmployeeFormRefactored mode="edit" employeeId={123} />
```

### Using Individual Components

```tsx
import { 
    PersonalInformationSection, 
    JobInformationSection, 
    BankInformationSection 
} from './EmployeeForm';

// Use individual sections
<PersonalInformationSection 
    formData={formData}
    errors={errors}
    mode="add"
    onFieldChange={handleChange}
    renderField={renderField}
/>
```

## Benefits of Refactoring

1. **Maintainability** - Each component has a single responsibility
2. **Reusability** - Components can be used independently
3. **Testability** - Smaller components are easier to test
4. **Readability** - Code is more organized and easier to understand
5. **Performance** - Components can be optimized individually
6. **Type Safety** - Better TypeScript support with dedicated type definitions

## File Sizes Comparison

- **Original**: `EmployeeForm.tsx` - 1041 lines (55KB)
- **Refactored**: Multiple smaller files totaling ~400 lines

## Migration

The original `EmployeeForm.tsx` has been updated to use the refactored version, maintaining backward compatibility. No changes are required in existing code that imports `EmployeeForm`.

## Component Dependencies

- React
- Next.js (Image component)
- react-datepicker
- react-icons
- react-toastify
- Redux Toolkit (for API calls)
- Uses existing `EmployeeFormData` interface from `src/types/employeesType.d.ts`

## Styling

All components use the existing CSS classes from the original form. No styling changes are required. 