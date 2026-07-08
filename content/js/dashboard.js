/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.56603773584905, "KoPercent": 1.4339622641509433};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.772609819121447, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05454545454545454, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d64000b-d4cb-4e89-bbe3-bfcc22b99b66"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/092fa527-cf0e-4827-9bb1-3f8f0509ab34"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2608a79-7309-4f52-91ca-d08cf92004d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f306da23-87e5-4a1d-a0a1-1d125068c71a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a92a6703-ab5a-4002-b2d4-847cb1adf5e1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adc85df3-f562-4901-baf9-5ff7af851837"], "isController": false}, {"data": [0.7291666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9df0cb4-3cba-4af7-b9b8-d5c78d85fbfa"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9f47a3b-3899-47bc-aec3-aa5a5533b678"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e34b68e9-25f6-4b63-89f6-a1769e9b5586"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95461c1a-ab14-491a-a76c-07bfbfac3885"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bd9556d-6eff-44a7-b093-8497b2fa7e56"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fb19474-9884-4cb4-914a-97d7ac5247c8"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2608a79-7309-4f52-91ca-d08cf92004d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b45e27d-18b1-489c-90e3-fe4ff1d0c841"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a92a6703-ab5a-4002-b2d4-847cb1adf5e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e34b68e9-25f6-4b63-89f6-a1769e9b5586"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f306da23-87e5-4a1d-a0a1-1d125068c71a"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65f94856-c63b-44ea-a641-21de71378138"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d64000b-d4cb-4e89-bbe3-bfcc22b99b66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=092fa527-cf0e-4827-9bb1-3f8f0509ab34"], "isController": false}, {"data": [0.9508670520231214, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65f94856-c63b-44ea-a641-21de71378138"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9f47a3b-3899-47bc-aec3-aa5a5533b678"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b45e27d-18b1-489c-90e3-fe4ff1d0c841"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a9df0cb4-3cba-4af7-b9b8-d5c78d85fbfa"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/adc85df3-f562-4901-baf9-5ff7af851837"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95766bab-e858-4ed9-a94f-7e703cd090d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bd9556d-6eff-44a7-b093-8497b2fa7e56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/95461c1a-ab14-491a-a76c-07bfbfac3885"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0fb19474-9884-4cb4-914a-97d7ac5247c8"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 19, 1.4339622641509433, 404.76377358490555, 102, 3028, 130.0, 1157.2000000000007, 1364.7, 1884.5600000000004, 5.14615067929189, 737.4252700636764, 3.764582934830313], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1862.4545454545455, 1301, 2546, 1883.0, 2192.6, 2365.199999999999, 2546.0, 0.23405052086879552, 281.64184345903266, 1.1508245825921735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2d64000b-d4cb-4e89-bbe3-bfcc22b99b66", 3, 0, 0.0, 370.3333333333333, 211, 541, 359.0, 541.0, 541.0, 541.0, 0.020321623562245133, 0.02801499862829041, 0.013031770318236624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/092fa527-cf0e-4827-9bb1-3f8f0509ab34", 3, 0, 0.0, 467.0, 236, 874, 291.0, 874.0, 874.0, 874.0, 0.043321925226357055, 0.02835950248379038, 0.02778131272653757], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 745.4666666666666, 120, 2853, 481.0, 2028.0000000000005, 2853.0, 2853.0, 0.09491508263939862, 0.01787073040319927, 0.06420980623085878], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 745.4666666666666, 120, 2853, 481.0, 2028.0000000000005, 2853.0, 2853.0, 0.09726554141242534, 0.018313277719058208, 0.06579988546982499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 121.74999999999999, 102, 326, 111.0, 118.9, 315.64999999999986, 326.0, 0.1015615081883966, 0.034802669163387076, 0.057495318649231936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 113.69999999999999, 103, 128, 113.5, 127.00000000000003, 128.0, 128.0, 0.10155996100097497, 0.07547571320482613, 0.05097833979931752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 250.15, 104, 903, 216.5, 341.8, 874.9499999999996, 903.0, 0.1015615081883966, 1.5191280785832169, 0.0593698425796623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 233.04999999999998, 103, 1184, 115.0, 342.8, 1141.9499999999994, 1184.0, 0.10155841386069232, 4.595126473549111, 0.05926885558901341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2608a79-7309-4f52-91ca-d08cf92004d4", 3, 0, 0.0, 437.3333333333333, 322, 498, 492.0, 498.0, 498.0, 498.0, 0.056055906424006874, 0.036403493917934154, 0.035947309783624204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f306da23-87e5-4a1d-a0a1-1d125068c71a", 3, 0, 0.0, 287.6666666666667, 216, 424, 223.0, 424.0, 424.0, 424.0, 0.020997522292369498, 0.024818360495961478, 0.013465207980458306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a92a6703-ab5a-4002-b2d4-847cb1adf5e1", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 296.8, 116, 665, 217.0, 590.6, 665.0, 665.0, 0.0947220854014322, 0.2005567487907147, 0.061230181377006525], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 112.85714285714286, 105, 130, 113.5, 123.0, 130.0, 130.0, 0.08509707144506985, 0.06324108532197084, 0.04271474094020107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 111.14285714285714, 104, 117, 112.0, 116.0, 117.0, 117.0, 0.08509914049868096, 0.03190030559709204, 0.0480226036993812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 801.1111111111112, 564, 906, 856.0, 906.0, 906.0, 906.0, 0.11991206448604357, 35.25812841416295, 0.06838734927719671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1195.888888888889, 931, 1467, 1244.0, 1467.0, 1467.0, 1467.0, 0.11914059914483525, 107.2029205373572, 0.06783102470843648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 249.66666666666663, 111, 447, 330.0, 447.0, 447.0, 447.0, 0.12111262128083326, 0.21431256812584945, 0.06706138307249263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 128.92857142857142, 105, 338, 113.0, 229.0, 338.0, 338.0, 0.07283207524593832, 0.0541261809200772, 0.036558287769933875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 160.5, 110, 343, 113.5, 341.5, 343.0, 343.0, 0.07283245414156549, 0.019488371518348577, 0.041537259002611564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 158.14285714285714, 107, 337, 113.0, 331.0, 337.0, 337.0, 0.07274730185453658, 0.01960767120298056, 0.042767456754327166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 175.57142857142858, 105, 342, 113.5, 342.0, 342.0, 342.0, 0.07274881393451567, 0.019608078755787427, 0.04283938945557905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 114.0, 109, 121, 115.0, 121.0, 121.0, 121.0, 0.12110773205587103, 0.0900029141548026, 0.06800483001184165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 866.1764705882354, 107, 1804, 1234.0, 1555.9999999999998, 1804.0, 1804.0, 0.08570492299160597, 45.3727120409115, 0.04605261084923496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 190.78571428571428, 105, 1213, 114.0, 664.5, 1213.0, 1213.0, 0.08509500249206792, 5.490485552464109, 0.04950420764396251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 540.5882352941178, 109, 1025, 663.0, 1017.8, 1025.0, 1025.0, 0.08570405884339852, 14.83294640471473, 0.04613584187853214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 175.49999999999997, 108, 552, 112.5, 447.5, 552.0, 552.0, 0.0850955197208867, 1.8085053541797098, 0.049587609636459785], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 563.4666666666666, 120, 1049, 511.0, 990.8000000000001, 1049.0, 1049.0, 0.09749376039933444, 0.01835624707518719, 0.0667540285234245], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 338.1428571428572, 221, 679, 232.0, 570.5, 679.0, 679.0, 0.0727042339829976, 0.11267736262794646, 0.16351352623324555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adc85df3-f562-4901-baf9-5ff7af851837", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 608.0416666666665, 130, 1250, 577.0, 1039.5, 1205.5, 1250.0, 0.1032635587203924, 0.06343044769055353, 0.04669045672611492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 125.76470588235291, 109, 326, 114.0, 159.59999999999985, 326.0, 326.0, 0.08570189854911728, 0.06369057108972485, 0.04301833579516238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 169.7058823529412, 104, 438, 115.0, 353.19999999999993, 438.0, 438.0, 0.08570492299160597, 0.0986532196062615, 0.044644545133724886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9df0cb4-3cba-4af7-b9b8-d5c78d85fbfa", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["login", 24, 0, 0.0, 2937.291666666666, 1716, 4200, 2880.0, 3875.0, 4121.75, 4200.0, 0.10062808697620984, 45.278794340561085, 0.21439973511752522], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 117.07142857142858, 111, 122, 117.0, 122.0, 122.0, 122.0, 0.07894039436365584, 0.0639077997338581, 0.02806084330895579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9f47a3b-3899-47bc-aec3-aa5a5533b678", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e34b68e9-25f6-4b63-89f6-a1769e9b5586", 3, 0, 0.0, 505.0, 326, 665, 524.0, 665.0, 665.0, 665.0, 0.030270619336871633, 0.02523536983129175, 0.019411822947147498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 993.7058823529412, 219, 1920, 1353.0, 1671.9999999999998, 1920.0, 1920.0, 0.08565267337108769, 60.331350870193376, 0.17974367020445797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95461c1a-ab14-491a-a76c-07bfbfac3885", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bd9556d-6eff-44a7-b093-8497b2fa7e56", 3, 0, 0.0, 405.0, 234, 671, 310.0, 671.0, 671.0, 671.0, 0.028254706763234976, 0.028337484224455388, 0.01811906651157972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 405.05, 224, 1299, 440.5, 461.8, 1257.1499999999994, 1299.0, 0.10150017255029334, 6.220914848016179, 0.22697777844034833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 2, 18.181818181818183, 1093.3636363636365, 116, 1580, 1193.0, 1573.8, 1580.0, 1580.0, 0.14539302377836819, 142.3221124615039, 0.28575202063259186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fb19474-9884-4cb4-914a-97d7ac5247c8", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["register", 25, 9, 36.0, 1074.9200000000003, 248, 1897, 1109.0, 1708.2000000000003, 1866.1, 1897.0, 0.10557699941721496, 0.03289383388092604, 0.04763337278393878], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 117.66666666666667, 111, 124, 119.0, 123.4, 124.0, 124.0, 0.08494107920472499, 0.06594546676538708, 0.030193899248554586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 338.5, 216, 1326, 229.0, 893.0, 1326.0, 1326.0, 0.08503814568249186, 7.38917778553076, 0.18969865366392924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 412.2666666666667, 221, 1246, 438.0, 773.2000000000003, 1246.0, 1246.0, 0.07490861149397735, 6.082803588996424, 0.16719348488593916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2608a79-7309-4f52-91ca-d08cf92004d4", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 115.88888888888889, 112, 120, 116.0, 120.0, 120.0, 120.0, 0.03906334772890037, 0.029030476193059745, 0.01960796946548319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 158.33333333333334, 106, 324, 114.0, 324.0, 324.0, 324.0, 0.03906470417167636, 0.010452860295936837, 0.02227908909790917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 137.22222222222223, 108, 332, 114.0, 332.0, 332.0, 332.0, 0.03906402593851322, 0.010528975741239892, 0.02296537462400875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 159.22222222222223, 107, 336, 114.0, 336.0, 336.0, 336.0, 0.03906402593851322, 0.010528975741239892, 0.023003523086839332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 2.457682291666667, 5.1513671875], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1293.654545454545, 852, 2071, 1247.0, 1725.6, 1872.9999999999995, 2071.0, 0.23271557925023273, 278.40873780887705, 0.459522364496065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1074.9200000000003, 248, 1897, 1109.0, 1708.2000000000003, 1866.1, 1897.0, 0.10374606283691534, 0.032323382702626434, 0.04680730569399891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 177.89999999999998, 108, 343, 114.0, 342.5, 343.0, 343.0, 0.06994816840721026, 0.01885321726600589, 0.04119018120073026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b45e27d-18b1-489c-90e3-fe4ff1d0c841", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5458128776435045, 2.082939954682779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a92a6703-ab5a-4002-b2d4-847cb1adf5e1", 3, 0, 0.0, 308.6666666666667, 217, 475, 234.0, 475.0, 475.0, 475.0, 0.017083406886890765, 0.02355085552278072, 0.01095517954660638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 132.8, 103, 319, 114.0, 298.70000000000005, 319.0, 319.0, 0.07006137376341674, 0.018883729647170923, 0.04118842481013368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 251.39999999999998, 104, 1146, 113.0, 1027.2, 1146.0, 1146.0, 0.08289262089888758, 9.964286664096996, 0.047781983427001996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 262.6666666666667, 104, 907, 114.0, 901.6, 907.0, 907.0, 0.08289262089888758, 3.2691209099399305, 0.04786293325209857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 142.39999999999998, 109, 336, 115.0, 325.8, 336.0, 336.0, 0.08299949093645559, 0.06168223886976827, 0.041661853848963065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 135.10000000000002, 105, 341, 113.5, 319.0000000000001, 341.0, 341.0, 0.07005990121553929, 0.01874649700493922, 0.03995603741198724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e34b68e9-25f6-4b63-89f6-a1769e9b5586", 1, 0, 0.0, 952.0, 952, 952, 952.0, 952.0, 952.0, 952.0, 1.050420168067227, 0.18977317489495799, 0.7242154674369748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 125.93333333333332, 107, 341, 111.0, 204.80000000000007, 341.0, 341.0, 0.0829985724245543, 0.0388299310835187, 0.046405712238416164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 112.8, 105, 117, 112.5, 116.9, 117.0, 117.0, 0.07005990121553929, 0.05206600080568886, 0.03516678635233124], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 600.2, 116, 1698, 520.0, 1203.6000000000004, 1698.0, 1698.0, 0.09485086282668218, 0.017685733797891783, 0.06455539843685779], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 140.3, 113, 349, 116.5, 326.5000000000001, 349.0, 349.0, 0.06951009286548407, 0.05471204575154312, 0.024708665823277538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1603.2916666666667, 923, 3028, 1382.0, 2637.0, 2947.0, 3028.0, 0.10173069342183903, 0.05265358155622528, 0.046792145118834165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 316.19999999999993, 220, 457, 233.0, 456.7, 457.0, 457.0, 0.06989145856484878, 0.10831811010001467, 0.15718752839340502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f306da23-87e5-4a1d-a0a1-1d125068c71a", 1, 0, 0.0, 1049.0, 1049, 1049, 1049.0, 1049.0, 1049.0, 1049.0, 0.9532888465204957, 0.17222503574833176, 0.6572479742612012], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 1181.6271186440677, 577, 4102, 934.0, 2053.0, 2264.0, 4102.0, 0.27493266479650325, 84.68057134735645, 1.000298741717071], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/65f94856-c63b-44ea-a641-21de71378138", 3, 0, 0.0, 296.3333333333333, 206, 473, 210.0, 473.0, 473.0, 473.0, 0.05335609860207022, 0.03430283031871376, 0.03421598771031196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d64000b-d4cb-4e89-bbe3-bfcc22b99b66", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 194.85454545454542, 107, 462, 116.0, 445.0, 453.0, 462.0, 0.2337481300149599, 0.17371320990369576, 0.11299348081777846], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 684.9272727272725, 522, 987, 664.0, 903.4, 933.1999999999997, 987.0, 0.2336776183577137, 68.70897862433986, 0.11752341157638922], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 168.58181818181822, 106, 348, 114.0, 340.0, 344.0, 348.0, 0.23409734193109025, 0.41424256208899957, 0.113848121368831], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1095.563636363636, 739, 1612, 1126.0, 1352.2, 1470.0, 1612.0, 0.233184236745596, 209.81958611785342, 0.11704755633519173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 130.26666666666665, 112, 315, 117.0, 204.00000000000006, 315.0, 315.0, 0.08033849284987414, 0.06001850295913448, 0.028557823630228695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=092fa527-cf0e-4827-9bb1-3f8f0509ab34", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, 3.468208092485549, 192.2196531791907, 106, 1909, 122.0, 319.79999999999995, 376.6999999999997, 1639.6399999999967, 0.701708843559489, 1.4927830525652934, 0.3383572927525239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 145.33333333333334, 112, 354, 119.0, 354.0, 354.0, 354.0, 0.039488405765307245, 0.030580376730360005, 0.014036894236886558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 119.84999999999998, 111, 145, 117.5, 132.8, 144.39999999999998, 145.0, 0.10217583439340762, 0.08291808435636887, 0.03632031613203161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65f94856-c63b-44ea-a641-21de71378138", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9f47a3b-3899-47bc-aec3-aa5a5533b678", 3, 0, 0.0, 357.6666666666667, 206, 520, 347.0, 520.0, 520.0, 520.0, 0.10129317621636223, 0.04583252439477327, 0.0649568870918729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 302.3333333333333, 228, 455, 234.0, 455.0, 455.0, 455.0, 0.03904402864964058, 0.06051061862009727, 0.08781093552746314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 426.26666666666665, 219, 1268, 232.0, 1264.4, 1268.0, 1268.0, 0.08284180528862085, 13.325616748611019, 0.1834870480289173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b45e27d-18b1-489c-90e3-fe4ff1d0c841", 3, 0, 0.0, 335.0, 223, 450, 332.0, 450.0, 450.0, 450.0, 0.0744324525493115, 0.03295186701401811, 0.04773174854236447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9df0cb4-3cba-4af7-b9b8-d5c78d85fbfa", 3, 0, 0.0, 500.3333333333333, 248, 712, 541.0, 712.0, 712.0, 712.0, 0.045170518708123164, 0.029334370059474514, 0.028966771437175333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/adc85df3-f562-4901-baf9-5ff7af851837", 3, 0, 0.0, 851.0, 226, 1896, 431.0, 1896.0, 1896.0, 1896.0, 0.03113195799261135, 0.031223164900792827, 0.01996417879083475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95766bab-e858-4ed9-a94f-7e703cd090d9", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bd9556d-6eff-44a7-b093-8497b2fa7e56", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 119.35714285714285, 109, 133, 118.0, 132.0, 133.0, 133.0, 0.07556620679232247, 0.06265206012371267, 0.026861425070708378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95461c1a-ab14-491a-a76c-07bfbfac3885", 3, 0, 0.0, 725.0, 209, 1698, 268.0, 1698.0, 1698.0, 1698.0, 0.018594733971339317, 0.02563434191686914, 0.011924357396985172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 157.7058823529412, 109, 354, 119.0, 342.0, 354.0, 354.0, 0.08408099472762703, 0.06527772539889012, 0.029888166094586173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 112.26666666666668, 106, 119, 111.0, 117.2, 119.0, 119.0, 0.07495165618176276, 0.055701377299142055, 0.03762221804436139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 194.8, 105, 333, 113.0, 330.6, 333.0, 333.0, 0.07495277974875829, 0.027560761720116327, 0.042326849709682896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fb19474-9884-4cb4-914a-97d7ac5247c8", 3, 0, 0.0, 353.6666666666667, 214, 596, 251.0, 596.0, 596.0, 596.0, 0.022011401906187403, 0.02601673187544481, 0.01411538468593398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 253.79999999999998, 105, 1127, 115.0, 655.4000000000003, 1127.0, 1127.0, 0.07495053264845201, 4.5148961451067295, 0.04363331138948294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 224.79999999999998, 104, 907, 115.0, 566.2000000000003, 907.0, 907.0, 0.0749542778904868, 1.4881254466025724, 0.04370868926205015], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 47.36842105263158, 0.6792452830188679], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07547169811320754], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07547169811320754], "isController": false}, {"data": ["401/Unauthorized", 8, 42.10526315789474, 0.6037735849056604], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 19, "406/Not Acceptable", 9, "401/Unauthorized", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
