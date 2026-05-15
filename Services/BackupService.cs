using System;
using System.Threading.Tasks;

namespace FirstPharmar.Services;

public interface IBackupService
{
    Task<BackupStatus> GetStatusAsync();
    Task<bool> StartBackupAsync();
}

public class BackupStatus
{
    public bool Connected { get; set; }
    public bool IsConfigured { get; set; }
    public DateTime? LastBackup { get; set; }
    public string LastStatus { get; set; } = "Ready";
    public long FileCount { get; set; }
}

public class BackupService : IBackupService
{
    private BackupStatus _status = new BackupStatus
    {
        Connected = false,
        IsConfigured = false,
        LastStatus = "Not Configured"
    };

    public Task<BackupStatus> GetStatusAsync()
    {
        return Task.FromResult(_status);
    }

    public async Task<bool> StartBackupAsync()
    {
        _status.LastStatus = "Backup in progress...";
        await Task.Delay(2000); // Simulate network
        _status.LastBackup = DateTime.Now;
        _status.LastStatus = "Completed Successfully";
        _status.FileCount++;
        return true;
    }
}
