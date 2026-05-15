using Microsoft.JSInterop;

namespace FirstPharmar.Services
{
    public class ShortcutService
    {
        public event Action<string>? OnShortcut;

        [JSInvokable]
        public static void OnGlobalShortcut(string action)
        {
            // Note: This needs a reference to the service instance.
            // In a real app, we'd use a static reference or a singleton.
            GlobalShortcutHandler?.Invoke(action);
        }

        public static Action<string>? GlobalShortcutHandler;

        public ShortcutService()
        {
            GlobalShortcutHandler = (action) => OnShortcut?.Invoke(action);
        }
    }
}
