function Table(props) {
    const { rows } = props.users;
    console.log("props",props);
    console.log("rows", rows);
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>In Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(product => (
            <tr key={rows.userId}>
              <td>{rows.name}</td>
              <td>{rows.username}</td>
              <td>{rows.isAdmin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
export default Table;