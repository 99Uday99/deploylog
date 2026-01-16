import net from 'net';

const client = new net.Socket();
client.connect(3000, '127.0.0.1', function () {
  console.log('Connected to 127.0.0.1:3000');
  client.destroy();
});

client.on('error', function () {
  console.log('Failed to connect to 127.0.0.1:3000');
  // console.error(err);

  // Try IPv6
  const client6 = new net.Socket();
  client6.connect(3000, '::1', function () {
    console.log('Connected to [::1]:3000');
    client6.destroy();
  });
  client6.on('error', () => {
    console.log('Failed to connect to [::1]:3000');
    // console.error(err6);
  });
});
