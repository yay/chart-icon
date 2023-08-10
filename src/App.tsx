import {} from 'react';
import './css/Glyphter.css';
import './App.css';
import Chart from './Chart';

// https://glyphter.com/
// https://icomoon.io/
function App() {
  return (
    <div style={{ width: '800px', height: '600px' }}>
      <Chart
        title={{
          text: '{custom|A} {custom2|A} {custom3|} YOLO ❤️',
          textStyle: {
            fontFamily: 'Verdana',
            fontWeight: 300,
            rich: {
              custom: {
                fontSize: 24,
                fontFamily: 'Glyphter',
                padding: [-2, 5, 0, 0],
              },
              custom2: {
                fontSize: 24,
                fontFamily: 'Glyphter',
                color: 'red',
                padding: [-2, 5, 0, 0],
              },
              custom3: {
                width: 22,
                height: 30,
                backgroundColor: {
                  image:
                    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiCiAgICBzdHJva2U9ImN1cnJlbnRDb2xvciIgY2xhc3M9InctNiBoLTYiPgogICAgPHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIgogICAgICAgIGQ9Ik04LjYyNSA5Ljc1YS4zNzUuMzc1IDAgMTEtLjc1IDAgLjM3NS4zNzUgMCAwMS43NSAwem0wIDBIOC4yNW00LjEyNSAwYS4zNzUuMzc1IDAgMTEtLjc1IDAgLjM3NS4zNzUgMCAwMS43NSAwem0wIDBIMTJtNC4xMjUgMGEuMzc1LjM3NSAwIDExLS43NSAwIC4zNzUuMzc1IDAgMDEuNzUgMHptMCAwaC0uMzc1bS0xMy41IDMuMDFjMCAxLjYgMS4xMjMgMi45OTQgMi43MDcgMy4yMjcgMS4wODcuMTYgMi4xODUuMjgzIDMuMjkzLjM2OVYyMWw0LjE4NC00LjE4M2ExLjE0IDEuMTQgMCAwMS43NzgtLjMzMiA0OC4yOTQgNDguMjk0IDAgMDA1LjgzLS40OThjMS41ODUtLjIzMyAyLjcwOC0xLjYyNiAyLjcwOC0zLjIyOFY2Ljc0MWMwLTEuNjAyLTEuMTIzLTIuOTk1LTIuNzA3LTMuMjI4QTQ4LjM5NCA0OC4zOTQgMCAwMDEyIDNjLTIuMzkyIDAtNC43NDQuMTc1LTcuMDQzLjUxM0MzLjM3MyAzLjc0NiAyLjI1IDUuMTQgMi4yNSA2Ljc0MXY2LjAxOHoiIC8+Cjwvc3ZnPg==',
                },
              },
            },
          },
        }}
        xAxis={{
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        }}
        yAxis={{
          type: 'value',
        }}
        series={[
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
          },
        ]}
      />
    </div>
  );
}

export default App;
