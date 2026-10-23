import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#f8fafc',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  /**
   * Show success toast notification
   */
  showSuccess(message: string, title: string = 'Success!'): void {
    this.toast.fire({
      icon: 'success',
      title: title,
      text: message
    });
  }

  /**
   * Show error toast or alert
   */
  showError(message: string, title: string = 'Error!'): void {
    this.toast.fire({
      icon: 'error',
      title: title,
      text: message,
      timer: 4500
    });
  }

  /**
   * Show info toast
   */
  showInfo(message: string, title: string = 'Information'): void {
    this.toast.fire({
      icon: 'info',
      title: title,
      text: message
    });
  }

  /**
   * Show confirmation dialog for deleting a product
   */
  async confirmDelete(itemName: string): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Delete Product?',
      html: `Are you sure you want to delete <strong>${itemName}</strong>?<br><span style="font-size: 0.875rem; color: #94a3b8;">This action cannot be undone.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      background: '#0f172a',
      color: '#f8fafc',
      customClass: {
        popup: 'swal2-dark-custom'
      }
    });

    return result.isConfirmed;
  }
}
