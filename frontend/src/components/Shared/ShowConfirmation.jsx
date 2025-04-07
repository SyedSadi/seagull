import React from 'react'
import Swal from 'sweetalert2'
const ShowConfirmation = () => {
  return Swal.fire({
    background: '#1f2937', // dark background
    color: '#fff',
    title: 'Are you sure?',
    text: 'Think twice before you delete!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#3b82f6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  });
}

export default ShowConfirmation