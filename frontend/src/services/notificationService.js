// Servicio para gestionar notificaciones de tareas

/**
 * Solicita permiso para mostrar notificaciones del navegador
 * @returns {Promise<boolean>} True si el permiso fue concedido
 */
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('Permiso de notificaciones denegado');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error al solicitar permiso para notificaciones:', error);
    return false;
  }
};

/**
 * Envía una notificación del navegador
 * @param {string} title Título de la notificación
 * @param {object} options Opciones adicionales de la notificación
 * @returns {Notification|boolean} La notificación creada o false si no se pudo crear
 */
const sendBrowserNotification = (title, options = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      silent: false
    };

    const notification = new Notification(title, { ...defaultOptions, ...options });
    
    notification.onclick = function() {
      window.focus();
      this.close();
    };
    
    return notification;
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    return false;
  }
};

/**
 * Identifica tareas que vencen pronto
 * @param {Array} tasks Lista de tareas
 * @returns {Array} Tareas próximas a vencer
 */
const checkUpcomingTasks = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  
  // Filtrar tareas que vencen pronto y no están completadas
  return tasks.filter(task => {
    if (task.status === 'completada') return false;
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate >= today && dueDate <= twoDaysFromNow;
  });
};

/**
 * Envía notificaciones para tareas próximas a vencer
 * @param {Array} tasks Lista de tareas
 * @returns {Array} Tareas notificadas
 */
const notifyUpcomingTasks = (tasks) => {
  const upcomingTasks = checkUpcomingTasks(tasks);
  
  if (upcomingTasks.length > 0) {
    // Agrupar tareas por fecha de vencimiento
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasksToday = upcomingTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
    
    const tasksTomorrow = upcomingTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === tomorrow.getTime();
    });
    
    const tasksLater = upcomingTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() > tomorrow.getTime();
    });
    
    // Enviar notificaciones separadas por urgencia
    if (tasksToday.length > 0) {
      sendBrowserNotification(
        `¡${tasksToday.length} ${tasksToday.length === 1 ? 'tarea vence' : 'tareas vencen'} hoy!`, 
        { 
          body: tasksToday.map(t => t.title).join(', '),
          tag: 'tasks-today',
          priority: 'high'
        }
      );
    }
    
    if (tasksTomorrow.length > 0) {
      sendBrowserNotification(
        `${tasksTomorrow.length} ${tasksTomorrow.length === 1 ? 'tarea vence' : 'tareas vencen'} mañana`, 
        { 
          body: tasksTomorrow.map(t => t.title).join(', '),
          tag: 'tasks-tomorrow'
        }
      );
    }
    
    if (tasksLater.length > 0) {
      sendBrowserNotification(
        `${tasksLater.length} ${tasksLater.length === 1 ? 'tarea próxima' : 'tareas próximas'} a vencer`, 
        { 
          body: tasksLater.map(t => t.title).join(', '),
          tag: 'tasks-upcoming'
        }
      );
    }
    
    return upcomingTasks;
  }
  
  return [];
};

export default {
  requestNotificationPermission,
  sendBrowserNotification,
  checkUpcomingTasks,
  notifyUpcomingTasks
};