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

    var data = {"OkPercent": 97.46835443037975, "KoPercent": 2.5316455696202533};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8118622448979592, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.26785714285714285, 500, 1500, "see books"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=048b1f59-b01f-4dc2-ae20-8af19432cd86"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77ef07d3-7890-402d-82e6-f0c5422c6305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2f643ba-fd0d-49e0-8a18-8449d58e9bea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef9348e7-8c5e-41f6-90fd-19f2b2f50b59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37a3460e-1471-4616-8d34-cad4f2c92006"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4dcd7e54-6e27-465a-8212-00a0391c241d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff5288c9-a2f7-4375-8f6d-1d123e372cee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc7b49ec-7b50-4647-9cd5-ae6757a82502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38a47e97-b8c6-495b-a8f1-147882282aa7"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b373cd33-29ca-4826-a138-c129c86d0198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45766833-bd61-48ce-80ad-9a5f62b82b18"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/507dd295-0ea4-4bb1-a600-ae27bebc593f"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2f643ba-fd0d-49e0-8a18-8449d58e9bea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84a1188a-bc84-4421-b80a-fcb5eae6cbd4"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77ef07d3-7890-402d-82e6-f0c5422c6305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=507dd295-0ea4-4bb1-a600-ae27bebc593f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc7b49ec-7b50-4647-9cd5-ae6757a82502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/048b1f59-b01f-4dc2-ae20-8af19432cd86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.33064516129032256, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3f50d8b-11fb-4363-b0dd-800bbd09e3d7"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8303571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8944444444444445, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef9348e7-8c5e-41f6-90fd-19f2b2f50b59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45766833-bd61-48ce-80ad-9a5f62b82b18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff5288c9-a2f7-4375-8f6d-1d123e372cee"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d686161b-7dd1-4e8f-ab04-856f8b9aebad"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38a47e97-b8c6-495b-a8f1-147882282aa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb125f53-eabe-4f21-85aa-1b10beb37b6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4dcd7e54-6e27-465a-8212-00a0391c241d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84a1188a-bc84-4421-b80a-fcb5eae6cbd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b373cd33-29ca-4826-a138-c129c86d0198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 34, 2.5316455696202533, 302.0863737900221, 92, 3525, 111.0, 760.0, 894.7999999999997, 1381.8799999999987, 5.249272020168462, 723.5056526839982, 3.835665881686177], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1427.0178571428569, 1129, 1866, 1413.0, 1650.9, 1798.85, 1866.0, 0.24677974467109987, 296.9602135484834, 1.2134140765810428], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 440.8666666666667, 101, 898, 413.0, 737.2, 898.0, 898.0, 0.07823460994831301, 0.015326037847296473, 0.05267593333889668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 440.8666666666667, 101, 898, 413.0, 737.2, 898.0, 898.0, 0.07752098234588828, 0.015186239315024599, 0.05219544267064952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 142.78947368421052, 93, 389, 98.0, 297.0, 389.0, 389.0, 0.09008966292241383, 0.031227625758057095, 0.05098104383099179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 117.8421052631579, 94, 291, 97.0, 290.0, 291.0, 291.0, 0.09009051726181727, 0.0669520348010185, 0.04522121667243562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 184.84210526315792, 93, 651, 102.0, 289.0, 651.0, 651.0, 0.09000900090009001, 1.4159115335875692, 0.052596234129991946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 238.3157894736842, 94, 856, 281.0, 305.0, 856.0, 856.0, 0.09000942730317545, 4.285648803644435, 0.05250858346479447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=048b1f59-b01f-4dc2-ae20-8af19432cd86", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["goToProfile", 19, 4, 21.05263157894737, 177.94736842105263, 93, 227, 190.0, 221.0, 227.0, 227.0, 0.09592229284571152, 0.15495670559933764, 0.06199254267279896], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/77ef07d3-7890-402d-82e6-f0c5422c6305", 3, 0, 0.0, 257.6666666666667, 189, 386, 198.0, 386.0, 386.0, 386.0, 0.03094282796819077, 0.031033480784503832, 0.019842894237414005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 116.81818181818181, 94, 289, 98.5, 234.69999999999987, 287.65, 289.0, 0.1639393126471728, 0.12183380559033057, 0.0822898502936004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 122.63636363636364, 92, 289, 97.0, 280.1, 287.79999999999995, 289.0, 0.16393686940192848, 0.08863419164220032, 0.09099194846420959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 566.3333333333333, 484, 746, 506.0, 746.0, 746.0, 746.0, 0.04220952809747587, 12.411002748895518, 0.02407262149309171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 763.5, 647, 900, 755.0, 900.0, 900.0, 900.0, 0.042160885940749904, 37.93643928041907, 0.024003707522907414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 191.0, 96, 290, 190.0, 290.0, 290.0, 290.0, 0.04233252195999577, 0.07490872049952375, 0.02343998042120859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2f643ba-fd0d-49e0-8a18-8449d58e9bea", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 122.75, 94, 304, 97.5, 291.40000000000003, 304.0, 304.0, 0.0869121209816724, 0.06458996490923116, 0.04362581072712853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 169.75, 93, 304, 102.0, 297.0, 304.0, 304.0, 0.08691400945189852, 0.023256287685371285, 0.04956814601553588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 166.0, 93, 382, 100.0, 319.00000000000006, 382.0, 382.0, 0.08691400945189852, 0.023426041610082025, 0.05109593133793253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 187.9375, 93, 381, 102.5, 329.20000000000005, 381.0, 381.0, 0.0869163701550914, 0.023426677893364476, 0.05118219844093761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef9348e7-8c5e-41f6-90fd-19f2b2f50b59", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 164.33333333333331, 94, 303, 102.0, 303.0, 303.0, 303.0, 0.04233311931589679, 0.03146045292909908, 0.023771038678360015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 671.9166666666666, 97, 864, 829.5, 862.5, 864.0, 864.0, 0.06472491909385113, 48.53590421049083, 0.03341592502696872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 360.2727272727272, 93, 3429, 98.0, 845.4, 3041.5499999999943, 3429.0, 0.16393809101544743, 26.8564766257815, 0.09381613411626191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 511.25000000000006, 94, 710, 577.5, 699.5, 710.0, 710.0, 0.0647259664395864, 15.862560309767689, 0.03347967469808034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 188.22727272727272, 93, 490, 98.0, 480.7, 488.65, 490.0, 0.16393564780661554, 8.80024720750527, 0.09397482935789386], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 302.6428571428571, 102, 663, 304.5, 545.0, 663.0, 663.0, 0.07972392742844776, 0.015704545972233294, 0.05415399032493195], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 337.62500000000006, 193, 590, 382.5, 582.3, 590.0, 590.0, 0.0868654074801974, 0.1346244156944075, 0.19536233733095176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37a3460e-1471-4616-8d34-cad4f2c92006", 2, 0, 0.0, 192.0, 191, 193, 192.0, 193.0, 193.0, 193.0, 0.015115672685223675, 0.025832448436661555, 0.009395630531391475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 415.9090909090909, 138, 1018, 361.0, 794.3999999999999, 992.1999999999996, 1018.0, 0.09656110781925517, 0.05931341486163232, 0.04365995402374525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 97.41666666666666, 94, 103, 96.5, 103.0, 103.0, 103.0, 0.06472456998613815, 0.048100974374464, 0.03248870016882325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4dcd7e54-6e27-465a-8212-00a0391c241d", 3, 0, 0.0, 458.3333333333333, 220, 768, 387.0, 768.0, 768.0, 768.0, 0.02426399223552248, 0.024335078150274993, 0.015559916895826593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 227.41666666666666, 93, 309, 284.5, 307.2, 309.0, 309.0, 0.06465865617759577, 0.09822980090522118, 0.03235037582843903], "isController": false}, {"data": ["login", 22, 0, 0.0, 2119.3181818181815, 1329, 3945, 2007.5, 3031.8999999999996, 3827.249999999998, 3945.0, 0.09916208042044722, 32.48953480870733, 0.19445944552621258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 130.22727272727275, 97, 307, 104.5, 291.4, 304.74999999999994, 307.0, 0.16888520412079897, 0.13672444747670154, 0.060033412402315266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff5288c9-a2f7-4375-8f6d-1d123e372cee", 3, 0, 0.0, 258.6666666666667, 183, 398, 195.0, 398.0, 398.0, 398.0, 0.024513408834632544, 0.029404919126178684, 0.015719861785229855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc7b49ec-7b50-4647-9cd5-ae6757a82502", 3, 0, 0.0, 454.0, 188, 789, 385.0, 789.0, 789.0, 789.0, 0.06167382768332546, 0.02790580093744218, 0.03954994809119503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38a47e97-b8c6-495b-a8f1-147882282aa7", 3, 0, 0.0, 286.3333333333333, 220, 380, 259.0, 380.0, 380.0, 380.0, 0.07041096533433473, 0.03185912819489755, 0.04515286513953106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 790.6666666666666, 199, 960, 929.0, 958.5, 960.0, 960.0, 0.06462487950152676, 64.44487859610527, 0.13156380091228786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b373cd33-29ca-4826-a138-c129c86d0198", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45766833-bd61-48ce-80ad-9a5f62b82b18", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 373.7368421052632, 193, 954, 384.0, 681.0, 954.0, 954.0, 0.08996765899416156, 5.796967335228968, 0.20112784374748444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/507dd295-0ea4-4bb1-a600-ae27bebc593f", 3, 0, 0.0, 312.6666666666667, 187, 450, 301.0, 450.0, 450.0, 450.0, 0.054415845894324424, 0.034984145716565995, 0.034895578259055704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 521.5833333333334, 93, 1204, 439.5, 1133.2000000000003, 1204.0, 1204.0, 0.07981164451893531, 47.75191485593998, 0.11619712894236268], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 811.5217391304349, 150, 1684, 869.0, 1261.4000000000003, 1612.999999999999, 1684.0, 0.09344161727126102, 0.029295724436607988, 0.042158229667307215], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e2f643ba-fd0d-49e0-8a18-8449d58e9bea", 3, 0, 0.0, 278.3333333333333, 196, 412, 227.0, 412.0, 412.0, 412.0, 0.061408715943749616, 0.039479887366180175, 0.039379938284240475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84a1188a-bc84-4421-b80a-fcb5eae6cbd4", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 493.68181818181813, 191, 3525, 206.5, 943.5, 3137.9999999999945, 3525.0, 0.1638196792112827, 35.84141591861885, 0.36081342520887005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 105.72222222222223, 96, 173, 102.0, 118.10000000000008, 173.0, 173.0, 0.13609145345672294, 0.10565693896298312, 0.04837625884594447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 265.46666666666664, 192, 608, 204.0, 481.4000000000001, 608.0, 608.0, 0.08819275408332451, 0.1366815436818711, 0.19834757095107067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 118.00000000000001, 95, 288, 97.0, 288.0, 288.0, 288.0, 0.04759134895034636, 0.03536818022579451, 0.023888626328591823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77ef07d3-7890-402d-82e6-f0c5422c6305", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 117.99999999999999, 94, 297, 95.0, 297.0, 297.0, 297.0, 0.047592355610081113, 0.012734673278478737, 0.02714251530887439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 118.33333333333333, 93, 281, 98.0, 281.0, 281.0, 281.0, 0.047592103941155005, 0.012827559265389435, 0.02797895173103058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=507dd295-0ea4-4bb1-a600-ae27bebc593f", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 115.33333333333333, 93, 279, 95.0, 279.0, 279.0, 279.0, 0.047546093296000846, 0.012815157958687729, 0.027998334235828624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.7243752263672583, 0.21363409996378122, 0.4477827327055415], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 887.3392857142858, 743, 1439, 773.5, 1227.9, 1377.85, 1439.0, 0.24183587980756774, 289.31978800494034, 0.47753139547939644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 811.5217391304349, 150, 1684, 869.0, 1261.4000000000003, 1612.999999999999, 1684.0, 0.09275016332093976, 0.02907894047052561, 0.04184626509206462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc7b49ec-7b50-4647-9cd5-ae6757a82502", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 0.9926596840659341, 3.7882039835164836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 153.42857142857142, 94, 303, 97.0, 303.0, 303.0, 303.0, 0.033341748155486864, 0.008986643057533567, 0.01963386146265486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 154.14285714285714, 96, 305, 101.0, 305.0, 305.0, 305.0, 0.033342859864723254, 0.00898694269791369, 0.01960195472515957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/048b1f59-b01f-4dc2-ae20-8af19432cd86", 3, 0, 0.0, 247.33333333333334, 183, 369, 190.0, 369.0, 369.0, 369.0, 0.10308569857741735, 0.0466435940828809, 0.06610638873616934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 129.44444444444443, 94, 305, 97.5, 286.1, 305.0, 305.0, 0.135137164221685, 0.03642368879412604, 0.07944587193501404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 160.33333333333334, 94, 291, 98.0, 289.2, 291.0, 291.0, 0.13513817878781054, 0.036423962251402056, 0.07957843926665015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 126.57142857142857, 94, 305, 95.0, 305.0, 305.0, 305.0, 0.033341748155486864, 0.008921522455667382, 0.0190152157449261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 109.00000000000001, 94, 290, 98.0, 124.40000000000026, 290.0, 290.0, 0.13512701939823435, 0.10042154468950813, 0.06782742965887935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 125.14285714285714, 96, 282, 98.0, 282.0, 282.0, 282.0, 0.033342383408830015, 0.02477886110753871, 0.016736313547010377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 140.66666666666666, 92, 303, 97.5, 300.3, 303.0, 303.0, 0.13514020796576448, 0.036160563459589325, 0.07707214985547506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 105.85714285714286, 98, 115, 104.0, 115.0, 115.0, 115.0, 0.03440987071720002, 0.02708433183404611, 0.012231633731504694], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 351.07142857142856, 96, 461, 382.5, 455.5, 461.0, 461.0, 0.07770439029805185, 0.015003191430315813, 0.05287974551812178], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1119.9545454545455, 622, 3197, 1008.5, 1632.1999999999998, 2971.999999999997, 3197.0, 0.09892531138990061, 0.05120157718422591, 0.04550177896937812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 310.85714285714283, 195, 585, 202.0, 585.0, 585.0, 585.0, 0.0333258746851895, 0.05164859680214428, 0.07495067324217913], "isController": false}, {"data": ["addBook", 62, 17, 27.419354838709676, 960.3870967741939, 487, 3966, 798.0, 1400.2, 2860.799999999991, 3966.0, 0.2899852201081364, 85.0564177646349, 1.0542110121887336], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b3f50d8b-11fb-4363-b0dd-800bbd09e3d7", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 167.0892857142857, 95, 630, 102.0, 392.90000000000003, 414.15, 630.0, 0.24251557946066268, 0.18022886325152762, 0.11723165218069143], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 537.3035714285716, 464, 925, 477.5, 699.0, 773.15, 925.0, 0.24272265469234905, 71.3685196301947, 0.1220724288735935], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 143.82142857142853, 95, 389, 100.5, 303.0, 309.29999999999995, 389.0, 0.2431125350559593, 0.43019522804824045, 0.11823246333776145], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 716.8392857142856, 644, 1054, 671.0, 862.9000000000001, 970.9, 1054.0, 0.24253238456974321, 218.23106596231221, 0.1217398883484844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 103.13333333333334, 97, 110, 103.0, 108.2, 110.0, 110.0, 0.09027063135279569, 0.06743850877430536, 0.03208838848868909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 17, 9.444444444444445, 164.14444444444436, 95, 2185, 104.0, 271.9, 292.9, 2013.2799999999995, 0.7200460829493088, 1.514975864705341, 0.34672531542018686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 123.11111111111111, 98, 283, 103.0, 283.0, 283.0, 283.0, 0.046401080629611104, 0.03593364935476719, 0.016494134130057073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef9348e7-8c5e-41f6-90fd-19f2b2f50b59", 3, 0, 0.0, 688.3333333333334, 205, 1483, 377.0, 1483.0, 1483.0, 1483.0, 0.03387074922097277, 0.028236649985322673, 0.02172049998870975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 113.15789473684212, 98, 286, 101.0, 116.0, 286.0, 286.0, 0.09561769027920367, 0.07759599670118969, 0.03398910084143567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45766833-bd61-48ce-80ad-9a5f62b82b18", 3, 0, 0.0, 252.66666666666666, 181, 356, 221.0, 356.0, 356.0, 356.0, 0.0914968891057704, 0.041399959588873984, 0.058674762870562405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff5288c9-a2f7-4375-8f6d-1d123e372cee", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 260.66666666666663, 192, 586, 199.0, 586.0, 586.0, 586.0, 0.04752123935392235, 0.07364863950651833, 0.10687638108601871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d686161b-7dd1-4e8f-ab04-856f8b9aebad", 2, 0, 0.0, 186.0, 182, 190, 186.0, 190.0, 190.0, 190.0, 0.011273385228483335, 0.022293559655936285, 0.007007333689384417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 304.8333333333333, 190, 581, 295.5, 420.80000000000024, 581.0, 581.0, 0.13502869359738945, 0.2092681022842354, 0.30368269663553504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38a47e97-b8c6-495b-a8f1-147882282aa7", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb125f53-eabe-4f21-85aa-1b10beb37b6e", 2, 0, 0.0, 200.0, 198, 202, 200.0, 202.0, 202.0, 202.0, 0.014121900242896683, 0.024134106860419138, 0.00877791943808959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 101.62500000000001, 97, 108, 101.0, 106.6, 108.0, 108.0, 0.0899669933593113, 0.07459177476763212, 0.031980454670692694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4dcd7e54-6e27-465a-8212-00a0391c241d", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 119.75, 96, 307, 98.5, 252.4000000000002, 307.0, 307.0, 0.06449671066775595, 0.050073129864126924, 0.02292656512017887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84a1188a-bc84-4421-b80a-fcb5eae6cbd4", 3, 0, 0.0, 289.0, 190, 357, 320.0, 357.0, 357.0, 357.0, 0.034667652768789865, 0.03499491902214107, 0.022231535141444023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 113.13333333333334, 95, 306, 99.0, 185.4000000000001, 306.0, 306.0, 0.08834962893155848, 0.06565826915714454, 0.044347372334786195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b373cd33-29ca-4826-a138-c129c86d0198", 3, 0, 0.0, 681.3333333333334, 185, 1398, 461.0, 1398.0, 1398.0, 1398.0, 0.06927606511950121, 0.03134561540237848, 0.044425080822075975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 110.26666666666667, 93, 278, 99.0, 174.20000000000005, 278.0, 278.0, 0.08834962893155848, 0.023640428053952174, 0.05038689775002945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 150.20000000000002, 94, 302, 101.0, 301.4, 302.0, 302.0, 0.08824567596187786, 0.023784967349099895, 0.05187880559477586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 122.2, 93, 288, 97.0, 286.2, 288.0, 288.0, 0.08825450245053336, 0.02378734636362032, 0.05197018064225743], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.58823529411765, 0.5212211466865228], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.29784065524944153], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.14892032762472077], "isController": false}, {"data": ["401/Unauthorized", 21, 61.76470588235294, 1.5636634400595681], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 34, "401/Unauthorized", 21, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
