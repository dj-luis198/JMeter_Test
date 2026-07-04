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

    var data = {"OkPercent": 98.11605124340618, "KoPercent": 1.8839487565938207};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.775661717236927, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15517241379310345, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4ee6b897-659d-465d-8f73-389be6b852c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=303eb66b-2901-4386-80d8-72a4656f4554"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8ff9e7f-aff7-4a3c-91b9-89d1bd6a6dce"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d60027a-ee79-4df3-844e-1c6827cd7deb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f093e46-fed7-4d04-bd30-dc9e79e3b217"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e8a122f-6bbc-47bf-854e-3516f3562792"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07ab38c2-583b-45e1-9687-f2ed06f66243"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b63271b9-1269-440d-bd6e-69f7932d348e"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/262953c1-d3bb-422c-9863-aa4267431db9"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f65b4786-f412-4f17-bae1-19f694299353"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9915857a-5123-43bd-ac75-e33756af0ddd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2d072d87-b506-4aae-a88b-42c5fcc54504"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bab37c2-c05a-4bbe-9283-cc0d20595e11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a268f1a1-52b0-48ef-bf1e-3764d77993da"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1bab37c2-c05a-4bbe-9283-cc0d20595e11"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07ab38c2-583b-45e1-9687-f2ed06f66243"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41379310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c9822bf-a6f6-4c66-966d-8775c0a72620"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8ff9e7f-aff7-4a3c-91b9-89d1bd6a6dce"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e8a122f-6bbc-47bf-854e-3516f3562792"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ee6b897-659d-465d-8f73-389be6b852c2"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6379310344827587, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.938953488372093, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f093e46-fed7-4d04-bd30-dc9e79e3b217"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b63271b9-1269-440d-bd6e-69f7932d348e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d072d87-b506-4aae-a88b-42c5fcc54504"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9915857a-5123-43bd-ac75-e33756af0ddd"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c9822bf-a6f6-4c66-966d-8775c0a72620"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/303eb66b-2901-4386-80d8-72a4656f4554"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=262953c1-d3bb-422c-9863-aa4267431db9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/699b18b4-a59f-4ea1-8b97-8059c41c5c50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a268f1a1-52b0-48ef-bf1e-3764d77993da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 25, 1.8839487565938207, 364.5184626978145, 92, 2863, 124.0, 1009.2, 1223.6, 1767.4000000000005, 5.1323504385897065, 743.6573407030296, 3.7483568598292054], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1665.068965517241, 1190, 2528, 1640.5, 1998.0, 2178.0499999999997, 2528.0, 0.25326404960482074, 304.7620694442928, 1.2452973532815161], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 555.6666666666667, 99, 1000, 571.0, 909.4000000000001, 1000.0, 1000.0, 0.09115714884746978, 0.017857543026174257, 0.061376773006545086], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 555.6666666666667, 99, 1000, 571.0, 909.4000000000001, 1000.0, 1000.0, 0.0912197910458653, 0.017869814534961507, 0.061418950455490826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 131.61111111111111, 93, 281, 100.0, 279.2, 281.0, 281.0, 0.08328166785420156, 0.02228435253130003, 0.04749657619809933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ee6b897-659d-465d-8f73-389be6b852c2", 3, 0, 0.0, 1157.3333333333333, 200, 2863, 409.0, 2863.0, 2863.0, 2863.0, 0.01745769418775168, 0.02406684078291939, 0.011195201025348572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 99.72222222222223, 95, 120, 96.5, 115.5, 120.0, 120.0, 0.0833518559679929, 0.061944103898088465, 0.04183872457768393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 120.77777777777777, 94, 288, 95.5, 281.7, 288.0, 288.0, 0.08328166785420156, 0.022447012038827766, 0.049041841519612835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=303eb66b-2901-4386-80d8-72a4656f4554", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 111.55555555555554, 93, 291, 97.0, 135.30000000000024, 291.0, 291.0, 0.08335417187630241, 0.022466554138534635, 0.04900313620071685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8ff9e7f-aff7-4a3c-91b9-89d1bd6a6dce", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 350.5333333333333, 96, 1941, 212.0, 1002.0000000000006, 1941.0, 1941.0, 0.09158627427036269, 0.16642943277567468, 0.059197169984125046], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1d60027a-ee79-4df3-844e-1c6827cd7deb", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 114.53333333333333, 94, 289, 101.0, 187.00000000000006, 289.0, 289.0, 0.08226390259953932, 0.06113557605297795, 0.041292622984534386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 115.8, 93, 289, 97.0, 186.40000000000006, 289.0, 289.0, 0.08217782184943928, 0.030217469909220897, 0.04640692882304923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 757.3333333333334, 739, 768, 763.0, 768.0, 768.0, 768.0, 0.06008953340477311, 17.668317981292127, 0.03426981201990967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 954.8333333333334, 835, 1113, 947.0, 1113.0, 1113.0, 1113.0, 0.05992449513612848, 53.92016605951501, 0.034117168617541896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 173.5, 94, 341, 106.5, 341.0, 341.0, 341.0, 0.06047777441790142, 0.10701731176292713, 0.033487205170849715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 100.72727272727272, 95, 115, 98.0, 114.8, 115.0, 115.0, 0.058823843977775285, 0.04371576686238964, 0.029526812309156734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 114.18181818181819, 92, 280, 96.0, 246.6000000000001, 280.0, 280.0, 0.0587672762435957, 0.023748991606964455, 0.03306702741760561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 197.1818181818182, 94, 1010, 97.0, 864.2000000000005, 1010.0, 1010.0, 0.058538662125485606, 4.80281555166037, 0.0339569973657602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 188.45454545454547, 93, 749, 96.0, 655.6000000000004, 749.0, 749.0, 0.05862039563437926, 1.5813039074490536, 0.034061655666460605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f093e46-fed7-4d04-bd30-dc9e79e3b217", 3, 0, 0.0, 379.33333333333337, 187, 652, 299.0, 652.0, 652.0, 652.0, 0.04122124817939487, 0.026984352242435897, 0.02643419886504163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e8a122f-6bbc-47bf-854e-3516f3562792", 3, 0, 0.0, 351.6666666666667, 195, 544, 316.0, 544.0, 544.0, 544.0, 0.04142902517503763, 0.026634871328352645, 0.026567441274356816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 162.83333333333331, 94, 289, 107.0, 289.0, 289.0, 289.0, 0.06036399488918177, 0.044860351670573555, 0.033895797911405776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 568.9090909090909, 94, 1379, 101.5, 1291.0, 1368.0499999999997, 1379.0, 0.10954865952276621, 44.82159479506931, 0.06012338540214317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 231.4, 93, 1116, 99.0, 650.4000000000003, 1116.0, 1116.0, 0.08226570726570727, 4.955550167342159, 0.047891924112627236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 397.5454545454547, 93, 1010, 97.5, 876.8999999999999, 997.0999999999998, 1010.0, 0.10954756854192187, 14.65729739301684, 0.06022976668857618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07ab38c2-583b-45e1-9687-f2ed06f66243", 3, 0, 0.0, 528.3333333333334, 226, 1035, 324.0, 1035.0, 1035.0, 1035.0, 0.02302767927048312, 0.02721793731481908, 0.01476709901134497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 192.4, 94, 871, 98.0, 558.4000000000002, 871.0, 871.0, 0.08217782184943928, 1.631540070590749, 0.04792101238967627], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 526.8, 100, 1005, 506.0, 991.8, 1005.0, 1005.0, 0.09142717825252186, 0.017910441364703013, 0.06216571937951422], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b63271b9-1269-440d-bd6e-69f7932d348e", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 333.45454545454544, 193, 1124, 203.0, 978.4000000000005, 1124.0, 1124.0, 0.058507837390763213, 6.445679212830237, 0.1302246085958651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 493.0, 156, 1105, 455.5, 967.7, 1084.4499999999998, 1105.0, 0.0998973781479026, 0.06136274497561596, 0.04516844343992081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 100.18181818181819, 94, 123, 98.0, 113.6, 121.94999999999999, 123.0, 0.1095453866454215, 0.08141019456754468, 0.054986649156002584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 133.86363636363635, 94, 342, 96.5, 289.4, 334.64999999999986, 342.0, 0.10954865952276621, 0.1041023483249014, 0.05829498092857427], "isController": false}, {"data": ["login", 22, 0, 0.0, 2739.5454545454545, 1450, 4239, 2684.0, 3669.9, 4155.749999999999, 4239.0, 0.09496184260506232, 31.11336589283556, 0.18622266879467522], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 105.13333333333334, 96, 121, 102.0, 120.4, 121.0, 121.0, 0.08120178643930166, 0.06573855562322371, 0.028864697523345514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/262953c1-d3bb-422c-9863-aa4267431db9", 3, 0, 0.0, 550.3333333333334, 301, 872, 478.0, 872.0, 872.0, 872.0, 0.0282845424975251, 0.02836740736812332, 0.018138199453165513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 670.1818181818182, 189, 1476, 213.0, 1387.8999999999999, 1464.8999999999999, 1476.0, 0.10949195731804429, 59.63367086095517, 0.23351609469561235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f65b4786-f412-4f17-bae1-19f694299353", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9915857a-5123-43bd-ac75-e33756af0ddd", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d072d87-b506-4aae-a88b-42c5fcc54504", 3, 0, 0.0, 880.0, 206, 1941, 493.0, 1941.0, 1941.0, 1941.0, 0.040176239771798954, 0.024992446029917903, 0.025764060009910137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bab37c2-c05a-4bbe-9283-cc0d20595e11", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 257.9444444444444, 191, 407, 216.0, 386.3, 407.0, 407.0, 0.08324315325064514, 0.1290106291101307, 0.18721580267210522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 709.5, 96, 1398, 956.5, 1388.5, 1398.0, 1398.0, 0.0995906822957644, 71.49770692454014, 0.16113461174572508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a268f1a1-52b0-48ef-bf1e-3764d77993da", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["register", 25, 8, 32.0, 1104.6, 215, 2371, 977.0, 1947.6000000000006, 2286.1, 2371.0, 0.10263147091424114, 0.03212044316269141, 0.04630443316638614], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1bab37c2-c05a-4bbe-9283-cc0d20595e11", 3, 0, 0.0, 565.3333333333334, 376, 785, 535.0, 785.0, 785.0, 785.0, 0.02149089502414144, 0.02540151036219322, 0.013781596092955286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 376.00000000000006, 192, 1405, 378.0, 837.4000000000003, 1405.0, 1405.0, 0.08213372465490147, 6.669504415372148, 0.18331969286093666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 107.1764705882353, 98, 129, 101.0, 126.6, 129.0, 129.0, 0.11054322239995838, 0.08582213067184269, 0.03929466108748521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 603.3076923076923, 201, 1243, 435.0, 1212.6, 1243.0, 1243.0, 0.07440178106417439, 27.467643049943625, 0.16147399765062068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 139.70000000000002, 95, 292, 100.0, 291.3, 292.0, 292.0, 0.05794078451822238, 0.04305950880699925, 0.02908355785387334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07ab38c2-583b-45e1-9687-f2ed06f66243", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 119.9, 94, 280, 97.5, 263.70000000000005, 280.0, 280.0, 0.05794884276161005, 0.015505842692071439, 0.03304894938748073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 196.8, 94, 338, 197.0, 333.40000000000003, 338.0, 338.0, 0.057949178570393764, 0.015619114536551444, 0.034067778807985394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 151.99999999999997, 94, 281, 98.0, 280.9, 281.0, 281.0, 0.057949178570393764, 0.015619114536551444, 0.03412436980268305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 100.5, 100, 101, 100.5, 101.0, 101.0, 101.0, 0.46479200557750405, 0.13707732976992795, 0.28731771438531256], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1138.9655172413793, 750, 2045, 1038.5, 1558.4, 1727.35, 2045.0, 0.24043344346290485, 287.6419865709631, 0.4747621315253844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1104.6, 215, 2371, 977.0, 1947.6000000000006, 2286.1, 2371.0, 0.09798004342475523, 0.03066469171559137, 0.04420583990452825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 97.66666666666667, 94, 111, 96.0, 111.0, 111.0, 111.0, 0.045257970431459314, 0.012198437342854269, 0.02665093375993161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 146.44444444444446, 94, 341, 98.0, 341.0, 341.0, 341.0, 0.045261384495461285, 0.0121993575397923, 0.026608743619402048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 143.41176470588235, 92, 295, 98.0, 291.0, 295.0, 295.0, 0.10206838581849839, 0.027510619615142146, 0.06000504713157816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 176.76470588235293, 94, 335, 100.0, 298.2, 335.0, 335.0, 0.10206838581849839, 0.027510619615142146, 0.060104723289604034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c9822bf-a6f6-4c66-966d-8775c0a72620", 3, 0, 0.0, 519.3333333333334, 242, 871, 445.0, 871.0, 871.0, 871.0, 0.07091863268876177, 0.03208883445227176, 0.04547842005106142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 139.88888888888889, 95, 300, 97.0, 300.0, 300.0, 300.0, 0.04526047402803132, 0.012110712777031818, 0.025812614094111615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 124.58823529411765, 95, 344, 98.0, 294.4, 344.0, 344.0, 0.10206777300127286, 0.07585310083395375, 0.05123323761977953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 145.11111111111111, 97, 285, 102.0, 285.0, 285.0, 285.0, 0.04526070164145478, 0.03363612690346395, 0.022718750628620856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 152.35294117647058, 93, 290, 97.0, 286.0, 290.0, 290.0, 0.10206838581849839, 0.027311267299090388, 0.05821087628711236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 159.11111111111111, 101, 323, 119.0, 323.0, 323.0, 323.0, 0.04704185156727769, 0.037027082385962716, 0.01672190817430574], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 559.4, 97, 1303, 493.0, 1142.2, 1303.0, 1303.0, 0.09235372708857954, 0.017755244537277042, 0.06284983784224751], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e8ff9e7f-aff7-4a3c-91b9-89d1bd6a6dce", 3, 0, 0.0, 438.6666666666667, 294, 655, 367.0, 655.0, 655.0, 655.0, 0.04349023644191879, 0.03625602067960743, 0.027889246676621102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1479.9545454545455, 977, 2407, 1352.5, 2273.2999999999997, 2395.0, 2407.0, 0.09895022803529825, 0.051214473494832095, 0.04551323965295456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 294.55555555555554, 195, 621, 200.0, 621.0, 621.0, 621.0, 0.04523545051995637, 0.0701061132570027, 0.10173558842525345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e8a122f-6bbc-47bf-854e-3516f3562792", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ee6b897-659d-465d-8f73-389be6b852c2", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["addBook", 57, 9, 15.789473684210526, 1053.4912280701753, 492, 3505, 854.0, 1811.2, 1857.3999999999992, 3505.0, 0.28984180739249155, 98.49701370773776, 1.0513121697964498], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 173.44827586206895, 95, 476, 104.0, 389.4, 434.0999999999999, 476.0, 0.24165961826113405, 0.17959274364914357, 0.11681788187427866], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 622.8275862068967, 462, 906, 580.0, 778.6, 860.8499999999999, 906.0, 0.2413197694980133, 70.95602480288751, 0.12136687626120785], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 144.4310344827586, 95, 474, 99.5, 286.1, 339.54999999999995, 474.0, 0.24199638674360482, 0.4282201687298945, 0.11768964902179219], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 964.0344827586208, 653, 1566, 934.5, 1223.8, 1297.75, 1566.0, 0.24086278711467146, 216.72875923739934, 0.12090182868841907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 110.6923076923077, 96, 155, 103.0, 145.39999999999998, 155.0, 155.0, 0.073159888121648, 0.054655580481504616, 0.026006053980742065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 9, 5.232558139534884, 166.0116279069767, 95, 2062, 107.0, 280.0, 374.35, 1013.7200000000147, 0.7272942539525483, 1.649262610309819, 0.34667136685863853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 109.5, 96, 138, 105.0, 136.20000000000002, 138.0, 138.0, 0.058570299001376405, 0.04535766319149559, 0.020819910973145516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f093e46-fed7-4d04-bd30-dc9e79e3b217", 1, 0, 0.0, 1005.0, 1005, 1005, 1005.0, 1005.0, 1005.0, 1005.0, 0.9950248756218905, 0.179765236318408, 0.6860230099502488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b63271b9-1269-440d-bd6e-69f7932d348e", 3, 0, 0.0, 579.3333333333333, 210, 1303, 225.0, 1303.0, 1303.0, 1303.0, 0.05332101025540764, 0.03316941751239714, 0.034193486394255554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 107.22222222222221, 96, 128, 101.0, 125.30000000000001, 128.0, 128.0, 0.08578045921139164, 0.06961285312955709, 0.030492272610299374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d072d87-b506-4aae-a88b-42c5fcc54504", 1, 0, 0.0, 983.0, 983, 983, 983.0, 983.0, 983.0, 983.0, 1.0172939979654119, 0.18378846642929808, 0.701376525940997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9915857a-5123-43bd-ac75-e33756af0ddd", 3, 0, 0.0, 400.66666666666663, 203, 792, 207.0, 792.0, 792.0, 792.0, 0.03493083694285315, 0.029120401500861627, 0.022400308846816635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 358.0, 193, 574, 382.0, 573.3, 574.0, 574.0, 0.05790823860510635, 0.08974645963506227, 0.13023698584722648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c9822bf-a6f6-4c66-966d-8775c0a72620", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 338.5882352941176, 194, 635, 381.0, 575.8, 635.0, 635.0, 0.10200652841781874, 0.15809019589753745, 0.22941507318968413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/303eb66b-2901-4386-80d8-72a4656f4554", 3, 0, 0.0, 872.3333333333334, 195, 1959, 463.0, 1959.0, 1959.0, 1959.0, 0.033463095782534494, 0.027896806086937124, 0.021459081605336248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=262953c1-d3bb-422c-9863-aa4267431db9", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/699b18b4-a59f-4ea1-8b97-8059c41c5c50", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 142.0909090909091, 96, 302, 112.0, 301.0, 302.0, 302.0, 0.057268103228359166, 0.04748107386804388, 0.020357021069455795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 119.36363636363635, 97, 315, 101.5, 192.09999999999997, 298.94999999999976, 315.0, 0.11024253357386249, 0.08558868573361395, 0.039187775606333936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a268f1a1-52b0-48ef-bf1e-3764d77993da", 3, 0, 0.0, 317.0, 212, 393, 346.0, 393.0, 393.0, 393.0, 0.033822634106744236, 0.028196538394326818, 0.021689644918712937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 112.84615384615384, 94, 281, 97.0, 216.59999999999994, 281.0, 281.0, 0.07452419169915157, 0.05538370105767026, 0.03740765091148819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 176.46153846153848, 93, 341, 101.0, 339.8, 341.0, 341.0, 0.07444651876624939, 0.05432493113697014, 0.04053398197248914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 484.46153846153845, 98, 1147, 286.0, 1115.8, 1147.0, 1147.0, 0.07444438717953122, 20.62471904401954, 0.04179667591495015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 332.6923076923076, 92, 758, 282.0, 749.6, 758.0, 758.0, 0.07452718235654951, 6.756511633406523, 0.041915941579288324], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 32.0, 0.6028636021100227], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15071590052750566], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15071590052750566], "isController": false}, {"data": ["401/Unauthorized", 13, 52.0, 0.9796533534287868], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 25, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
