export const toggleClass = (element: HTMLElement, className: string, force?: boolean): boolean => {
  const actionMap = {
    true: 'add',
    false: 'remove',
    undefined: 'toggle',
  } as const;

  type ActionKey = keyof typeof actionMap;

  element.classList[actionMap[String(force) as ActionKey] as typeof actionMap[ActionKey]](
    className,
  );

  return element.classList.contains(className);
};
