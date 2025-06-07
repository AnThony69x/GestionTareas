// Servicio para gestionar notificaciones de tareas

/**
 * Verifica si el navegador soporta notificaciones
 * @returns {boolean} True si el navegador soporta notificaciones
 */
const isNotificationSupported = () => {
  return 'Notification' in window;
};

/**
 * Verifica el estado actual del permiso de notificaciones
 * @returns {string} Estado del permiso ('granted', 'denied', 'default')
 */
const getNotificationPermissionStatus = () => {
  return Notification.permission;
};

/**
 * Solicita permiso para mostrar notificaciones del navegador
 * @returns {Promise<boolean>} True si el permiso fue concedido
 */
const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    console.log('Este navegador no soporta notificaciones');
    return false;
  }

  const currentStatus = getNotificationPermissionStatus();
  
  if (currentStatus === 'granted') {
    return true;
  }

  if (currentStatus === 'denied') {
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
 * Configura las opciones por defecto para las notificaciones
 * @returns {object} Opciones por defecto
 */
const getDefaultNotificationOptions = () => {
  return {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    silent: false
  };
};

/**
 * Maneja el click en la notificación
 * @param {Notification} notification La notificación que recibió el click
 */
const handleNotificationClick = (notification) => {
  window.focus();
  notification.close();
};

/**
 * Envía una notificación del navegador
 * @param {string} title Título de la notificación
 * @param {object} options Opciones adicionales de la notificación
 * @returns {Notification|boolean} La notificación creada o false si no se pudo crear
 */
const sendBrowserNotification = (title, options = {}) => {
  if (!isNotificationSupported() || getNotificationPermissionStatus() !== 'granted') {
    return false;
  }

  try {
    const mergedOptions = { ...getDefaultNotificationOptions(), ...options };
    const notification = new Notification(title, mergedOptions);
    
    notification.onclick = (e) => handleNotificationClick(notification);
    
    return notification;
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    return false;
  }
};

/**
 * Verifica si una tarea está completa
 * @param {object} task La tarea a verificar
 * @returns {boolean} True si la tarea está completa
 */
const isTaskCompleted = (task) => {
  return task.status === 'completada';
};

/**
 * Normaliza la fecha eliminando la hora
 * @param {Date} date La fecha a normalizar
 * @returns {Date} Fecha normalizada
 */
const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

/**
 * Verifica si una tarea vence hoy
 * @param {object} task La tarea a verificar
 * @param {Date} today La fecha actual
 * @returns {boolean} True si la tarea vence hoy
 */
const isTaskDueToday = (task, today) => {
  const dueDate = normalizeDate(task.dueDate);
  return dueDate.getTime() === today.getTime();
};

/**
 * Verifica si una tarea vence mañana
 * @param {object} task La tarea a verificar
 * @param {Date} tomorrow La fecha de mañana
 * @returns {boolean} True si la tarea vence mañana
 */
const isTaskDueTomorrow = (task, tomorrow) => {
  const dueDate = normalizeDate(task.dueDate);
  return dueDate.getTime() === tomorrow.getTime();
};

/**
 * Verifica si una tarea vence después de mañana
 * @param {object} task La tarea a verificar
 * @param {Date} tomorrow La fecha de mañana
 * @returns {boolean} True si la tarea vence después de mañana
 */
const isTaskDueAfterTomorrow = (task, tomorrow) => {
  const dueDate = normalizeDate(task.dueDate);
  return dueDate.getTime() > tomorrow.getTime();
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

  const today = normalizeDate(new Date());
  const tomorrow = normalizeDate(new Date(today));
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return tasks.filter(task => {
    if (isTaskCompleted(task)) return false;
    
    const dueDate = normalizeDate(task.dueDate);
    return dueDate >= today && dueDate <= tomorrow;
  });
};

/**
 * Crea el mensaje de notificación para tareas del día
 * @param {Array} tasks Lista de tareas
 * @returns {string} Mensaje de notificación
 */
const createTodayNotificationMessage = (tasks) => {
  const count = tasks.length;
  const isSingle = count === 1;
  return `¡${count} ${isSingle ? 'tarea vence' : 'tareas vencen'} hoy!`;
};

/**
 * Crea el mensaje de notificación para tareas de mañana
 * @param {Array} tasks Lista de tareas
 * @returns {string} Mensaje de notificación
 */
const createTomorrowNotificationMessage = (tasks) => {
  const count = tasks.length;
  const isSingle = count === 1;
  return `${count} ${isSingle ? 'tarea vence' : 'tareas vencen'} mañana`;
};

/**
 * Crea el mensaje de notificación para tareas próximas
 * @param {Array} tasks Lista de tareas
 * @returns {string} Mensaje de notificación
 */
const createUpcomingNotificationMessage = (tasks) => {
  const count = tasks.length;
  const isSingle = count === 1;
  return `${count} ${isSingle ? 'tarea próxima' : 'tareas próximas'} a vencer`;
};

/**
 * Envía notificaciones para tareas próximas a vencer
 * @param {Array} tasks Lista de tareas
 * @returns {Array} Tareas notificadas
 */
const notifyUpcomingTasks = (tasks) => {
  const upcomingTasks = checkUpcomingTasks(tasks);
  
  if (upcomingTasks.length === 0) {
    return [];
  }

  const today = normalizeDate(new Date());
  const tomorrow = normalizeDate(new Date(today));
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Agrupar tareas por fecha de vencimiento
  const tasksToday = upcomingTasks.filter(task => isTaskDueToday(task, today));
  const tasksTomorrow = upcomingTasks.filter(task => isTaskDueTomorrow(task, tomorrow));
  const tasksLater = upcomingTasks.filter(task => isTaskDueAfterTomorrow(task, tomorrow));

  // Enviar notificaciones separadas por urgencia
  if (tasksToday.length > 0) {
    sendBrowserNotification(
      createTodayNotificationMessage(tasksToday),
      { 
        body: tasksToday.map(t => t.title).join(', '),
        tag: 'tasks-today',
        priority: 'high'
      }
    );
  }

  if (tasksTomorrow.length > 0) {
    sendBrowserNotification(
      createTomorrowNotificationMessage(tasksTomorrow),
      { 
        body: tasksTomorrow.map(t => t.title).join(', '),
        tag: 'tasks-tomorrow'
      }
    );
  }

  if (tasksLater.length > 0) {
    sendBrowserNotification(
      createUpcomingNotificationMessage(tasksLater),
      { 
        body: tasksLater.map(t => t.title).join(', '),
        tag: 'tasks-upcoming'
      }
    );
  }

  return upcomingTasks;
};

export default {
  requestNotificationPermission,
  sendBrowserNotification,
  checkUpcomingTasks,
  notifyUpcomingTasks
};