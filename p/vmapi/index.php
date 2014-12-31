<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/include/2013.php';

$PR->head('VMAPI for VirtualBox','/p/vmapi/','en');
?>
<body data-spy="scroll" data-target="#lnav">
<?php
$PR->header();
?>
<div class="container"><div class="row"><div class="span2">

<div id="lnav" data-spy="affix"><ul class="nav nav-list hash-scroll">
  <li><a href="#sysreq">System Requirements</a>
  <li><a href="#envsetup">Environment Setup</a>
  <li><a href="#hostapi">VMAPI host commands</a>
  <li><a href="#network">VM Networking</a>
  <li><a href="#adv">Advanced Topics</a>
</ul></div>

</div><div class="span10">

<h1>VMAPI for VirtualBox</h1>

<p>VMAPI is a collection of scripts that allows easy creation of virtual machines and network topologies in <a href="https://www.virtualbox.org">Oracle VM VirtualBox</a>.

<h2 id="sysreq">System Requirements</h2>

<p class="lead">Recommended <strong>host system</strong>: Ubuntu Server 12.04 64-bit.
<p>VMAPI is developed on Ubuntu 12.04, which is supported until April 2017. A Server installation is preferred over the Desktop edition, because it contains significantly fewer packages, so that there's less overhead. VirtualBox has a <em>headless</em> frontend which can run without a graphic interface.
<p>VMAPI is likely to work on other linux hosts, but I don't have time and resource to test them.
<p>64-bit CPU and 64-bit OS are required to run VirtualBox efficiently. In addition, Intel VT-x and VT-d (or AMD's equivalent) should be enabled in BIOS settings, so that VMs can execute at the same speed of the physical machine.
<p>VirtualBox must be installed on the host system. On Ubuntu you can type <code>sudo apt-get install virtualbox</code> to install VirtualBox. I suggest not to compile VirtualBox from source because you are more likely to run into problems. You also need to <a href="https://www.virtualbox.org/manual/ch01.html#intro-installing">install Oracle VM VirtualBox Extension Pack</a> to get VRDP support, which is necessary when preparing OS templates.

<p class="lead">Supported <strong>guest systems</strong>:
<ul>
  <li>Ubuntu Server 12.04 64-bit
  <li>FreeBSD 9.0-RELEASE 64-bit
</ul>
<p>It's not too difficult to support a new guest OS, if you understand the network configuration files of that OS. Guest OS must have an SSH server.

<h2 id="envsetup">Environment Setup</h2>

<h3>Create a runner account</h3>
<p>Each VM corresponds to a user-level process. It's a good idea to create a separate user account to run these processes, so that you won't accidentally kill a VM process (which would power off the VM). This user account is called a <em>runner account</em>.
<p>You can create a runner account 'vbox1' with <code>sudo adduser vbox1</code>. It should be same as a regular user account (not a system / service account). It does not need (and should not be given) sudo privilege. <span class="text-warning">NEVER run any VM under root account</span>.
<p>If you have many VMs to deal with, you can create multiple runner accounts. It's a good idea to create a group that contains all runner accounts.
<p>Unless otherwise noted, all subsequent actions are executed in the shell of a runner account. You can easily get a shell of a runner account with <code>sudo -iu vbox1</code>.

<h3>Create directory structure</h3>
<ol>
  <li>Create a <strong>VMAPI host directory</strong> (eg. /data1/vbox1) to store all files of a runner account. Make sure there is sufficient disk space. As a reference, a recently-created Ubuntu 12.04 VM, after installing ns-3.16 inside, takes 7.3GB.
  <li>Create subdirectories under the VMAPI host directory: <code>mkdir osimage vmapi-host vm vmdata vmdata/hostport</code>
  <li>Download <a href="http://code.google.com/p/yoursunny/downloads/detail?name=vmapi-host_20130113.tar.gz">VMAPI host scripts</a> and place them into vmapi-host/ subdirectory. Make them executable.
  <li>Edit ~/.bashrc and append these line at the end:
    <pre>export VMAPI_ROOT=/data1/vbox1<br>export PATH=$PATH:$VMAPI_ROOT/vmapi-host<br>cd $VMAPI_ROOT</pre>
    Therefore you are changed into VMAPI host directory automatically, and can type VMAPI host commands without typing the full path.
</ol>

<h3>Download guest OS templates</h3>
<p>OS installation is a long and tedious process. VMAPI creates VMs by cloning <strong>guest OS template</strong>, so that a VM can be ready in one or two minutes.
<p>A guest OS template consists of:
<ul>
  <li>VM hardware spec, which is a series of VBoxManage commands that configures the VM
  <li>virtual disk image (VDI)
  <li>SSH key pair for VM master account
</ul>
<p>You may download these prepared guest OS templates. See README in each folder about how to download. They should be uncompressed and placed in osimage/$template/</p>
<ul>
  <li><a href="https://skydrive.live.com/redir?resid=1FA4AA816E7DC9F3!7846">UbuntuPrecise</a> Ubuntu Server 12.04 x64
</ul>


<p>The procedure of creating a guest OS template is in "Advanced Topics".</p>

<?php $PR->adsense(728,90); ?>

<h2 id="hostapi">VMAPI Host Commands</h2>
<p>These commands can be executed on the host machine, under the runner account.
<table class="table">
<thead>
  <tr>
    <th>command
    <th>description
    <th>VM power state
<tbody>
  <tr>
    <td>vmcreate $vmname $template $sshhostport
    <td>create a new VM, and redirect host's $sshhostport to guest's port 22
    <td><i class="icon-hdd"></i><i class="icon-chevron-right"></i><i class="icon-play"></i><i class="icon-chevron-right"></i><i class="icon-off"></i>
  <tr>
    <td>vmadduser $vmname $newuser $pw
    <td>add a user to guest
    <td><i class="icon-play"></i>
  <tr>
    <td>vmdestroy $vmname
    <td>destroy a VM (unregister and delete all files)
    <td><i class="icon-question-sign"></i><i class="icon-chevron-right"></i><i class="icon-trash"></i>
  <tr>
    <td>vmstart $vmname
    <td>boot a VM
    <td><i class="icon-off"></i><i class="icon-chevron-right"></i><i class="icon-play"></i>
  <tr>
    <td>vmshutdown $vmname
    <td>shut down by sending shutdown command via SSH<br><small>if the VM is still running after 15 seconds, perform hard power off</small>
    <td><i class="icon-play"></i><i class="icon-chevron-right"></i><i class="icon-off"></i>
  <tr>
    <td>vmssh $vmname &lt;$command&gt;
    <td>SSH into VM as master, and optionally run a command
    <td><i class="icon-play"></i>
  <tr>
    <td>vmintnet $vmname $int $netname $ip $mask
    <td>add an interface and attach to internal network<br><small>(example: vmintnet vm2 eth1 net6 192.168.6.2 255.255.255.0)</small>
    <td><i class="icon-question-sign"></i><i class="icon-chevron-right"></i><i class="icon-off"></i><i class="icon-chevron-right"></i><i class="icon-play"></i>
  <tr>
    <td>vmsaveall
    <td>save the states of all running VMs<br><small>execute this before rebooting host machine</small>
    <td><i class="icon-play"></i><i class="icon-chevron-right"></i><i class="icon-hdd"></i>
  <tr>
    <td>vmrestoreall
    <td>resume all saved VMs
    <td><i class="icon-hdd"></i><i class="icon-chevron-right"></i><i class="icon-play"></i>
</table>
<p>The quick sequence of creating a new VM is:
<pre>vmcreate vm25 UbuntuPrecise 22025<br>vmstart vm25<br>vmadduser vm25 user password</pre>

<h2 id="network">VM Networking</h2>
<p>VirtualBox allows up to 8 network cards (NICs) per VM. VMAPI configures the first NIC in NAT + DHCP mode, so that you can SSH into the VM, and the VM can access Internet. The other 7 NICs are available for your experiments.
<p>vmintnet command adds a NIC to a VM, and attaches it to an internal network. The internal network is identified by its name: each internal network is a different network. Each internal network behaves like a Ethernet layer-2 switch interconnecting all NICs attached to it.
<p>A network topology can be created among a set of VMs by creating a separate internal network for each link. For example, the following commands create an <a href="http://noc.net.internet2.edu/uploads/f9/a4/f9a4dfc8040e43b7b8a36c4bf0489230/internet2-ip-igp-metrics.jpg">Internet2 topology</a>:
<pre>vmcreate I2STTLng UbuntuPrecise 22121
vmcreate I2CHIC UbuntuPrecise 22122
vmcreate I2NEWY UbuntuPrecise 22123
vmcreate I2WASH UbuntuPrecise 22124
vmcreate I2ATLA UbuntuPrecise 22125
vmcreate I2HOUS UbuntuPrecise 22126
vmcreate I2LOSA UbuntuPrecise 22127
vmcreate I2SALT UbuntuPrecise 22128
vmcreate I2KANS UbuntuPrecise 22129

# STTLng-SALT
vmintnet I2STTLng eth1 I2l0 10.21.69.0 255.255.255.254
vmintnet I2SALT eth1 I2l0 10.21.69.1 255.255.255.254
# STTLng-LOSA
vmintnet I2STTLng eth2 I2l1 10.21.69.2 255.255.255.254
vmintnet I2LOSA eth1 I2l1 10.21.69.3 255.255.255.254
# NEWY-WASH
vmintnet I2NEWY eth1 I2l2 10.21.69.4 255.255.255.254
vmintnet I2WASH eth1 I2l2 10.21.69.5 255.255.255.254
# CHIC-KANS
vmintnet I2CHIC eth1 I2l3 10.21.69.6 255.255.255.254
vmintnet I2KANS eth1 I2l3 10.21.69.7 255.255.255.254
# CHIC-NEWY
vmintnet I2CHIC eth2 I2l4 10.21.69.8 255.255.255.254
vmintnet I2NEWY eth2 I2l4 10.21.69.9 255.255.255.254
# CHIC-ATLA
vmintnet I2CHIC eth3 I2l5 10.21.69.10 255.255.255.254
vmintnet I2ATLA eth1 I2l5 10.21.69.11 255.255.255.254
# CHIC-WASH
vmintnet I2CHIC eth4 I2l6 10.21.69.12 255.255.255.254
vmintnet I2WASH eth2 I2l6 10.21.69.13 255.255.255.254
# ATLA-HOUS
vmintnet I2ATLA eth2 I2l7 10.21.69.14 255.255.255.254
vmintnet I2HOUS eth1 I2l7 10.21.69.15 255.255.255.254
# WASH-ATLA
vmintnet I2WASH eth3 I2l8 10.21.69.16 255.255.255.254
vmintnet I2ATLA eth3 I2l8 10.21.69.17 255.255.255.254
# LOSA-SALT
vmintnet I2LOSA eth2 I2l9 10.21.69.18 255.255.255.254
vmintnet I2SALT eth2 I2l9 10.21.69.19 255.255.255.254
# HOUS-KANS
vmintnet I2HOUS eth2 I2l10 10.21.69.20 255.255.255.254
vmintnet I2KANS eth2 I2l10 10.21.69.21 255.255.255.254
# HOUS-LOSA
vmintnet I2HOUS eth3 I2l11 10.21.69.22 255.255.255.254
vmintnet I2LOSA eth3 I2l11 10.21.69.23 255.255.255.254
# SALT-KANS
vmintnet I2SALT eth3 I2l12 10.21.69.24 255.255.255.254
vmintnet I2KANS eth3 I2l12 10.21.69.25 255.255.255.254

for vmname in I2STTLng I2CHIC I2NEWY I2WASH I2ATLA I2HOUS I2LOSA I2SALT I2KANS; do vmssh $vmname sudo shutdown -r now; done</pre>
<p>This would probably take some time, because VM must be rebooted after adding each NIC. Otherwise, if multiple NICs are added before rebooting, their names in OS cannot be reliably determined.
<p>VirtualBox also supports bridges networking which exposes a VM's NIC to the physical network, and host-only networking which connects a set of VMs to a TAP interface on the host machine. VMAPI does not directly support these modes, but you can use vmintnet to add the interface, and manually modify the configuration with <a href="https://www.virtualbox.org/manual/ch08.html#idp12976496">VBoxManage modifyvm</a> command.

<?php $PR->adsense(728,90); ?>

<h2 id="adv">Advanced Topics</h2>

<h3>Create and Update Guest OS Template</h3>

<p>To <strong>create a guest OS template</strong>, there's more work than installing an OS, but this cost is amortized over hundreds of VMs based on this template.
<ol>
  <li>Use a separate runner account other than the one you use to run regular VMs.
  <li>Download the installation CD of the guest OS.
  <li>Create a VM, and start it.
<pre>VBoxManage createvm --name UbuntuPrecise --basefolder /data1/vbox0/vm/ --register
VBoxManage modifyvm UbuntuPrecise --ostype Ubuntu_64 --memory 1024 --cpus 4 --acpi on --ioapic on --hwvirtex on --nestedpaging on --boot1 disk --boot2 dvd --boot3 none --boot4 none
VBoxManage modifyvm UbuntuPrecise --nic1 nat --nictype1 virtio --natnet1 "192.168.254/24" --natpf1 ssh,tcp,,2222,,22
VBoxManage modifyvm UbuntuPrecise --audio none --clipboard disabled --usb off
VBoxManage modifyvm UbuntuPrecise --vrde on --vrdeport 3389 --vrdeauthtype null

VBoxManage createhd --filename /data1/vbox1/vm/UbuntuPrecise/main.vdi -size 12288
VBoxManage storagectl UbuntuPrecise --name SATA --add sata
VBoxManage storageattach UbuntuPrecise --storagectl SATA --port 0 --type hdd --medium /data1/vbox0/vm/UbuntuPrecise/main.vdi 

VBoxManage storagectl UbuntuPrecise --name IDE --add ide
VBoxManage storageattach UbuntuPrecise --storagectl IDE --port 1 --device 0 --type dvddrive --medium /data1/dvds/ubuntu-12.04-server-amd64.iso
  # insert OS installation CD
VBoxManage startvm UbuntuPrecise --type headless</pre>
  In these command lines: '2222' is SSH host port, '3389' is VRDP host port; they must be above 1024 and not occupied by other VMs or services. '12288' is VM's disk space (MB); it's very difficult to increase disk space after guest OS template is created, so allocate sufficient space for your experiments here. You may tune other parameters as needed, especially for non-Ubuntu systems.
  <li>On a machine with graphical interface, use a RDP client (Terminal Server Client, not VNC client) to connect to port 3389 of host machine. <small>If firewall restricts this connection, you can specify another port number in the command line above, or use SSH tunnel.</small>
  <li>Complete OS installation over RDP session, and install an SSH server. Create a 'master' user (with that name) and grant sudo privilege with NOPASSWD option.
  <li>Create a new SSH key pair: <code>ssh-keygen -t rsa -N '' -f /data1/vbox0/vm/UbuntuPrecise/id_rsa</code> Even if you already have an SSH key pair for personal or project use, you should create a new pair for guest OS templates. <code>cat /data1/vbox0/vm/UbuntuPrecise/id_rsa.pub</code> and copy the public key on your clipboard.
  <li>SSH into the VM: <code>ssh -p 2222 master@localhost</code> then enter the password chosen during OS installation. Inside the VM, <code>umask 077; mkdir .ssh; vi .ssh/authorized_keys</code> and paste the SSH public key. Exit from SSH session.
  <li>SSH into the VM with private key: <code>ssh -i /data1/vbox1/vm/UbuntuPrecise/id_rsa.vm -p 2222 master@localhost</code>
  <li>Inside the VM: update existing packages, and install necessary new packages, such as <pre>sudo apt-get install virtualbox-guest-utils build-essential php5-cli python3 \<br>  default-jdk ant curl traceroute tcpdump tshark libpcap-dev libexpat1-dev libssl-dev subversion git</pre> VirtualBox guest additions (Ubuntu package virtual-guest-utils) should always be installed if available for the guest OS.
  <li>Download <a href="http://code.google.com/p/yoursunny/downloads/detail?name=vmapi-guest_20130105.tar.gz">VMAPI guest scripts</a> and copy the scripts suitable for the guest OS into /home/master/vmapi-guest/
  <li>Make guest OS forget about Ethernet cards, so an Ethernet card with a different address is still named eth0. <code>sudo rm /etc/udev/rules.d/*net*</code> Exit from SSH session.
  <li>At host machine's runner account shell: <pre>VBoxManage guestcontrol UbuntuPrecise exec --image '/bin/rm' --username master --password 123456 \<br>  --wait-stderr -- /home/master/.bash_history<br>VBoxManage guestcontrol UbuntuPrecise exec --image '/bin/sh' --username master --password 123456 \<br> --wait-stderr -- -c 'sudo shutdown -h now'</pre> (replace '123456' with master's password). This makes guest OS forget about entered commands, and turns off the VM.
</ol>
<p>At this point, main.vdi (in /data1/vbox0/vm/UbuntuPrecise/) is the VDI for this new guest OS template, and id_rsa + id_rsa.pub is an SSH key pair that can manage the VM using master account. These files should be copied to /data1/vbox1/osimage/UbuntuPrecise/ so they become a guest OS template. If you have multiple runner accounts, you may copy them to a central location, and create symlinks in /data1/vbox1/osimage/UbuntuPrecise/

<p>To <b>upgrade a guest OS template</b>, start the VM with <code>VBoxManage startvm UbuntuPrecise --type headless</code>, SSH into the VM, and upgrade the packages. Perform the last two steps above, and copy main.vdi to osimage directory.

<h3>VMAPI Host Directory</h3>
<p>The subdirectories and files in <em>VMAPI host directory</em> are:
<table class="table">
<thead>
  <tr>
    <th style="min-width:25em;">path
    <th>description
<tbody>
  <tr>
    <td><i class="icon-folder-open"></i> $R
    <td>VMAPI root directory
  <tr>
    <td style="text-indent:2em;"><i class="icon-folder-open"></i> $R/osimage
    <td>guest OS templates
  <tr>
    <td style="text-indent:4em;"><i class="icon-folder-open"></i> $R/osimage/$template
    <td>a guest OS template named $template
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/osimage/$template/main.vdi
    <td>main disk image
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/osimage/$template/*.vdi
    <td><span class="label">optional</span> additional disk image(s)
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/osimage/$template/id_rsa
    <td>SSH private key for master account
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/osimage/$template/id_rsa.pub
    <td>SSH public key for master account
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/osimage/$template/nictype
    <td><span class="label">optional</span> virtual NIC type if not 'virtio'
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/osimage/$template/create.sh
    <td><span class="label">optional</span> a script to run during VM creation, will receive $vmname as $1, can configure using VBoxManage modifyvm and/or attach additional disks
  <tr>
    <td style="text-indent:2em;"><i class="icon-folder-close"></i> $R/vmapi-host
    <td>VMAPI host scripts
  <tr>
    <td style="text-indent:2em;"><i class="icon-folder-open"></i> $R/vm
    <td>VM files
  <tr>
    <td style="text-indent:4em;"><i class="icon-folder-close"></i> $R/vm/$vmname
    <td>a VM named $vmname; contains definition file and disk images of a running VM
  <tr>
    <td style="text-indent:2em;"><i class="icon-folder-open"></i> $R/vmdata
    <td>VM metadata
  <tr>
    <td style="text-indent:4em;"><i class="icon-folder-open"></i> $R/vmdata/$vmname
    <td>metadata for VM $vmname
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/vmdata/$vmname/sshconfig
    <td>a ssh_config file used by <code>vmssh</code> command
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/vmdata/$vmname/users
    <td>list of users named added by <code>vmadduser</code>
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/vmdata/$vmname/template
    <td>template name
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/vmdata/$vmname/sshport
    <td>SSH host port
  <tr>
    <td style="text-indent:4em;"><i class="icon-folder-open"></i> $R/vmdata/hostport
    <td>host port mapping; reduces the possibility of port conflicts, but port conflicts can still happen among multiple runner accounts or with other services
  <tr>
    <td style="text-indent:6em;"><i class="icon-file"></i> $R/vmdata/hostport/$port
    <td>VM name having this host port
</table>

<h3>VMAPI Guest Commands</h3>
<p>These commands are exposed by a guest OS. New guest OS templates are expected to support these commands. These scripts are places in /home/master/vmapi-guest/ directory, and are executed over SSH under master account with sudo prepended. They are typically called by VMAPI host scripts, and are not used directly.

<table class="table">
<thead>
  <tr>
    <th>command
    <th>description
<tbody>
  <tr>
    <td>hostname.sh $hostname
    <td>set the hostname
  <tr>
    <td>sshhostkey.sh
    <td>generate a new SSH host key
  <tr>
    <td>ip.sh clear
    <td>remove all IP address configuration, then add eth0 as DHCP
  <tr>
    <td>ip.sh $int $ip $mask<br><small>(example: ip.sh eth1 192.168.5.2 255.255.255.0)
    <td>assign IP address to a network interface. interfaces must be added in-order (eth0,eth1,eth2,eth3,eth4,eth5,eth6,eth7); reboot is required after adding each interface
  <tr>
    <td>adduser.sh $newuser $pw
    <td>add a new user, and add it to sudoers list
  <tr>
    <td>shutdown.sh
    <td>shutdown OS and power off
</table>


</div></div></div>

<?php
$PR->footer();
?>
