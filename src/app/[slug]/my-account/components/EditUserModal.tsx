'use client';
import { useEffect, useState } from 'react'
import Modal from '@/components/common/Modal'
import { toast } from 'react-toastify'
import { useUpdateUserMutation } from '@/slices/users/userApi';
import { useRouter } from 'next/navigation';
import { useUser } from '@/provider/UserContext';
import { clearStorage } from '@/utils/Company';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface UserFormData {
    name: string
    email: string
    number: string
    password: string
}

export const EditUserModal = ({
    userId,
    userData,
    isOpen,
    onClose
}: {
    userId: number | null
    userData: {
        name?: string;
        email?: string;
        number?: string;
    } | null;
    isOpen: boolean
    onClose: () => void
}) => {
    const [updateUser, { isLoading }] = useUpdateUserMutation()
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        number: '',
        password: ''
    })
    const [errors, setErrors] = useState<Partial<UserFormData>>({})
    const { user: currentUser, setUser } = useUser()
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false) 

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                number: userData.number || '',
                password: ''
            })
            setErrors({})
        }
    }, [userData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user types
        if (errors[name as keyof UserFormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<UserFormData> = {}

        if (formData.name && formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        }

        if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address'
        }

        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleLogout = () => {
        setUser(null)
        // Clear any user-related storage
        clearStorage();
        router.push('/login')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm() || !userId) return

        try {
            // Track if password was changed
            const passwordChanged = !!formData.password

            const updateData: {
                id: number;
                name: string;
                email: string;
                number?: string;
                password?: string
            } = {
                id: userId,
                name: formData.name,
                email: formData.email,
            };

            if (formData.number !== userData?.number) updateData.number = formData.number
            if (formData.password) updateData.password = formData.password

            // Check if there are any meaningful changes
            const changed =
                formData.name !== userData?.name ||
                formData.email !== userData?.email ||
                formData.number !== userData?.number ||
                passwordChanged

            if (!changed) {
                toast.info('No changes detected')
                return
            }

            await updateUser(updateData).unwrap()
            toast.success('Profile updated successfully')

            if (passwordChanged) {
                toast.info('Please login again with your new password')
                handleLogout()
                return
            }

            // Update user context if name/email changed
            if (currentUser && (formData.name !== userData?.name || formData.email !== userData?.email)) {
                setUser({
                    ...currentUser,
                    name: formData.name,
                    email: formData.email,
                    number: formData.number || currentUser.number
                })
            }

            onClose()
        } catch (error) {
            toast.error('Failed to update profile')
            console.error('Update error:', error)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" width="500px">
            <form onSubmit={handleSubmit} className="edit-user-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter your name"
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Enter your email"
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        type="tel"
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                    <label>New Password</label>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="buttons"
                    >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}