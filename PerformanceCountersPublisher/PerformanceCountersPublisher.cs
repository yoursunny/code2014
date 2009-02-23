using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Diagnostics;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// publishes statistics to Windows Performance Counters
    /// </summary>
    [Plugin("PerformanceCountersPublisher", "PerformanceCountersPublisher", "yoursunny.P2008.hProxyN.PerformanceCountersPublisherConfigurationSection")]
    public class PerformanceCountersPublisher : IPlugin
    {
        PerformanceCountersPublisherConfigurationSection sec;
        string instance_name;
        PerformanceCounterCategory category;
        PerformanceCounter total_requests;
        PerformanceCounter requests_sec;
        PerformanceCounter wait_time;
        PerformanceCounter wait_time_base;
        PerformanceCounter execution_time;
        PerformanceCounter execution_time_base;
        Guid PluginStorage_WorkerStartTime;
        public PerformanceCountersPublisher(PluginConfigurationSectionBase sec)
        {
            this.sec = (PerformanceCountersPublisherConfigurationSection)sec;
            instance_name = this.sec.InstanceName.Replace("{#PID}", Process.GetCurrentProcess().Id.ToString());
            PluginStorage_WorkerStartTime = new Guid("{686DCEEE-6DA5-489b-A7CA-2ED68F2CAE64}");
        }
        PerformanceCounter GetPerfCounter(string name)
        {
            PerformanceCounter pc = new PerformanceCounter();
            pc.CategoryName = "hProxyN";
            pc.CounterName = name;
            pc.InstanceLifetime = PerformanceCounterInstanceLifetime.Process;
            pc.InstanceName = instance_name;
            pc.ReadOnly = false;
            return pc;
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerOpen += new EventHandler<RequestListenerEventArgs>(ListenerOpen);
            listener.ListenerGotRequest += new EventHandler<RequestListenerEventArgs>(GotRequest);
            listener.WorkerStart += new EventHandler<HttpWorkerEventArgs>(WorkerStart);
            listener.WorkerFinish += new EventHandler<HttpWorkerEventArgs>(WorkerFinish);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerOpen -= new EventHandler<RequestListenerEventArgs>(ListenerOpen);
            listener.ListenerGotRequest -= new EventHandler<RequestListenerEventArgs>(GotRequest);
            listener.WorkerStart -= new EventHandler<HttpWorkerEventArgs>(WorkerStart);
            listener.WorkerFinish -= new EventHandler<HttpWorkerEventArgs>(WorkerFinish);
        }
        void ListenerOpen(object sender, RequestListenerEventArgs e)
        {
            if (!PerformanceCounterCategory.Exists("hProxyN"))
            {
                CounterCreationDataCollection ccdc = new CounterCreationDataCollection();
                ccdc.Add(new CounterCreationData("Total Requests", "requests received so far", PerformanceCounterType.NumberOfItems64));
                ccdc.Add(new CounterCreationData("Requests/Sec", "requests received per second", PerformanceCounterType.RateOfCountsPerSecond32));
                ccdc.Add(new CounterCreationData("Request Wait Time", "time from got request to start processing", PerformanceCounterType.AverageTimer32));
                ccdc.Add(new CounterCreationData("Request Wait Time base", "", PerformanceCounterType.AverageBase));
                ccdc.Add(new CounterCreationData("Request Execution Time", "time processing", PerformanceCounterType.AverageTimer32));
                ccdc.Add(new CounterCreationData("Request Execution Time base", "", PerformanceCounterType.AverageBase));
                category = PerformanceCounterCategory.Create("hProxyN", "", PerformanceCounterCategoryType.MultiInstance, ccdc);
            }
            else
            {
                category = new PerformanceCounterCategory("hProxyN");
            }

            total_requests = GetPerfCounter("Total Requests");
            requests_sec = GetPerfCounter("Requests/Sec");
            wait_time = GetPerfCounter("Request Wait Time");
            wait_time_base = GetPerfCounter("Request Wait Time base");
            execution_time = GetPerfCounter("Request Execution Time");
            execution_time_base = GetPerfCounter("Request Execution Time base");

            total_requests.RawValue = 0;
            requests_sec.RawValue = 0;
            wait_time.RawValue = 0;
            wait_time_base.RawValue = 0;
            execution_time.RawValue = 0;
            execution_time_base.RawValue = 0;
        }
        void GotRequest(object sender, RequestListenerEventArgs e)
        {
            total_requests.Increment();
            requests_sec.Increment();
        }
        void WorkerStart(object sender, HttpWorkerEventArgs e)
        {
            DateTime WorkerStartTime = DateTime.UtcNow;
            e.StoreData(PluginStorage_WorkerStartTime, WorkerStartTime);
            wait_time.IncrementBy((WorkerStartTime - e.log.time_start).Ticks);
            wait_time_base.Increment();
        }
        void WorkerFinish(object sender, HttpWorkerEventArgs e)
        {
            DateTime WorkerStartTime = (DateTime)e.RetrieveData(PluginStorage_WorkerStartTime);
            execution_time.IncrementBy((e.log.time_stop - WorkerStartTime).Ticks);
            execution_time_base.Increment();
        }
    }
    /// <summary>
    /// PerformanceCountersPublisher element
    /// </summary>
    public class PerformanceCountersPublisherConfigurationSection : PluginConfigurationSectionBase
    {
        /// <summary>
        /// PerformanceCounter InstanceName; {#PID} for Process.Id
        /// </summary>
        [ConfigurationProperty("InstanceName")]
        public string InstanceName
        {
            get { return (string)this["InstanceName"]; }
        }
    }
}
