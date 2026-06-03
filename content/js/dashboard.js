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

    var data = {"OkPercent": 97.27838258164853, "KoPercent": 2.7216174183514776};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7999334221038615, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db5b5a5a-26d6-44ea-ae21-ed5e3d30d342"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c1dea0d-daf4-4865-9cfb-3c2b36b62074"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a73755aa-5b1c-4997-b466-1c2de5f3a740"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cbd9e21-f319-4d2e-8bc1-7c1809d2d065"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03abaf7b-c0dd-4865-99bf-f79989537e6a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19844b06-e4ea-4501-8182-c8420b6cd235"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddc20985-da45-450b-98ce-f8ba55539997"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3986687-252b-4ec2-8cf0-d96d1b7754d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db09dbd4-555d-4a17-ab34-f8575518179c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44ec8af8-9ed4-4df7-870e-3f7370451b7e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81bda7a3-9c65-49e6-9e9a-15ea071d0a43"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/36f2a17d-a357-41cf-9f96-5f2a5faa83c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c1dea0d-daf4-4865-9cfb-3c2b36b62074"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/439f3eb4-6081-4d0c-84c8-7f411b257e31"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=439f3eb4-6081-4d0c-84c8-7f411b257e31"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7563f8ba-da4f-4cae-9875-d87d845de5cf"], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a73755aa-5b1c-4997-b466-1c2de5f3a740"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db5b5a5a-26d6-44ea-ae21-ed5e3d30d342"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03abaf7b-c0dd-4865-99bf-f79989537e6a"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19844b06-e4ea-4501-8182-c8420b6cd235"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9088235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cbd9e21-f319-4d2e-8bc1-7c1809d2d065"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44ec8af8-9ed4-4df7-870e-3f7370451b7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3986687-252b-4ec2-8cf0-d96d1b7754d5"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81bda7a3-9c65-49e6-9e9a-15ea071d0a43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ddc20985-da45-450b-98ce-f8ba55539997"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36f2a17d-a357-41cf-9f96-5f2a5faa83c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1286, 35, 2.7216174183514776, 302.3646967340584, 1, 2475, 94.5, 885.0, 1051.6499999999999, 1486.0, 5.127407708654793, 709.2580596689114, 3.7481093992340786], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db5b5a5a-26d6-44ea-ae21-ed5e3d30d342", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["see books", 54, 1, 1.8518518518518519, 1387.6296296296293, 999, 2052, 1388.5, 1730.5, 1837.0, 2052.0, 0.23726460275754194, 285.51671232545675, 1.164040839993585], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 589.4000000000001, 87, 1655, 436.0, 1311.2000000000003, 1655.0, 1655.0, 0.07358604416143798, 0.01497590976879265, 0.04931127295271361], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 589.4000000000001, 87, 1655, 436.0, 1311.2000000000003, 1655.0, 1655.0, 0.07515368929460747, 0.015294950047847849, 0.05036177890035121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 138.83333333333334, 82, 250, 85.5, 248.2, 250.0, 250.0, 0.09568309758081235, 0.04157065133610814, 0.05367639046145831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 104.33333333333331, 82, 251, 85.0, 250.1, 251.0, 251.0, 0.09568106312292358, 0.07110672757475082, 0.048027408637873754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c1dea0d-daf4-4865-9cfb-3c2b36b62074", 3, 0, 0.0, 705.3333333333334, 357, 1348, 411.0, 1348.0, 1348.0, 1348.0, 0.0678671613428649, 0.03070812313365306, 0.04352158458510542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 154.5, 81, 531, 84.5, 491.4000000000001, 531.0, 531.0, 0.09568258895822923, 3.14890818856912, 0.055430701220484574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 186.7222222222222, 82, 974, 83.0, 899.3000000000001, 974.0, 974.0, 0.09568309758081235, 9.58912623059095, 0.055337555350014084], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 260.40000000000003, 84, 715, 200.0, 523.6000000000001, 715.0, 715.0, 0.0739980661838704, 0.13420821144207432, 0.04782414082078655], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a73755aa-5b1c-4997-b466-1c2de5f3a740", 3, 0, 0.0, 339.6666666666667, 188, 480, 351.0, 480.0, 480.0, 480.0, 0.021028577837280866, 0.024855067098687116, 0.013485123157370866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 85.27777777777779, 82, 91, 85.0, 90.1, 91.0, 91.0, 0.0895669438265984, 0.06656293383988415, 0.04495840735046052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 111.72222222222223, 83, 249, 84.5, 245.4, 249.0, 249.0, 0.08949747169642458, 0.02394756566876986, 0.05104152682686714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 585.1428571428571, 406, 746, 647.0, 746.0, 746.0, 746.0, 0.03886125421922189, 11.426499055532734, 0.022163059046899983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 890.2857142857142, 722, 1051, 904.0, 1051.0, 1051.0, 1051.0, 0.03875732928780639, 34.87391302128608, 0.02206594040506946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 180.42857142857142, 83, 257, 248.0, 257.0, 257.0, 257.0, 0.038911803617685974, 0.06885565249535837, 0.02154589126096479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 98.75000000000001, 82, 249, 84.5, 201.90000000000015, 249.0, 249.0, 0.06053207695644717, 0.04498526422251592, 0.030384265191029148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 110.66666666666666, 81, 247, 83.5, 247.0, 247.0, 247.0, 0.060532993003394896, 0.016197304768486524, 0.03452272257224865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 111.16666666666667, 82, 250, 84.0, 249.1, 250.0, 250.0, 0.06053268765133172, 0.016315450968523, 0.03558659957627119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 111.0, 82, 246, 84.0, 245.4, 246.0, 246.0, 0.06053268765133172, 0.016315450968523, 0.03564571352905569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 107.0, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.03894795996149716, 0.028944724151073572, 0.021870192361192253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 572.2222222222222, 82, 1148, 566.5, 1146.2, 1148.0, 1148.0, 0.09205230616597031, 41.426818935990404, 0.050161315274034605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 120.38888888888889, 82, 250, 85.0, 247.3, 250.0, 250.0, 0.08949658172778123, 0.024122125543816035, 0.05261420136730889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 396.7222222222222, 83, 750, 490.0, 743.7, 750.0, 750.0, 0.09193758459534694, 15.029181404346605, 0.04974964565722604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 107.72222222222221, 82, 340, 84.5, 259.0000000000001, 340.0, 340.0, 0.08956917228132681, 0.02414169096645137, 0.05274434656800789], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 458.53333333333336, 86, 873, 509.0, 798.6, 873.0, 873.0, 0.07546941979110065, 0.015359206137173217, 0.050956598480045884], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9cbd9e21-f319-4d2e-8bc1-7c1809d2d065", 3, 0, 0.0, 253.33333333333331, 175, 385, 200.0, 385.0, 385.0, 385.0, 0.024572037021869112, 0.029043315894012614, 0.015757458637071012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03abaf7b-c0dd-4865-99bf-f79989537e6a", 3, 0, 0.0, 298.3333333333333, 196, 406, 293.0, 406.0, 406.0, 406.0, 0.04325508968221928, 0.027808854857546573, 0.027738452693350252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19844b06-e4ea-4501-8182-c8420b6cd235", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 225.0, 166, 496, 171.5, 447.70000000000016, 496.0, 496.0, 0.060506438893538926, 0.09377316262113894, 0.1360803991912306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 494.7619047619047, 96, 934, 516.0, 838.8000000000001, 926.9999999999999, 934.0, 0.08943553401531477, 0.05493647548401659, 0.04043813696200267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 94.72222222222221, 84, 247, 85.0, 108.40000000000022, 247.0, 247.0, 0.09212863204336187, 0.06846668846191249, 0.046244254756140635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 146.0, 83, 334, 88.5, 261.10000000000014, 334.0, 334.0, 0.09205183541131828, 0.09375982845117672, 0.04863285445070624], "isController": false}, {"data": ["login", 21, 0, 0.0, 2304.5238095238096, 1326, 4223, 2263.0, 2742.8, 4075.199999999998, 4223.0, 0.09082730701359815, 36.342483182080635, 0.1872426221735407], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddc20985-da45-450b-98ce-f8ba55539997", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3986687-252b-4ec2-8cf0-d96d1b7754d5", 3, 0, 0.0, 362.0, 277, 413, 396.0, 413.0, 413.0, 413.0, 0.03706678198554395, 0.030901050997714213, 0.023770039229010935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 95.8888888888889, 84, 252, 86.0, 108.00000000000023, 252.0, 252.0, 0.08938236783823778, 0.07236131146279211, 0.03177263856749858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db09dbd4-555d-4a17-ab34-f8575518179c", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44ec8af8-9ed4-4df7-870e-3f7370451b7e", 3, 0, 0.0, 368.3333333333333, 194, 501, 410.0, 501.0, 501.0, 501.0, 0.019435590453237967, 0.026793530458809507, 0.012463578513306902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81bda7a3-9c65-49e6-9e9a-15ea071d0a43", 3, 0, 0.0, 447.0, 172, 829, 340.0, 829.0, 829.0, 829.0, 0.03426182889642649, 0.02784888891744041, 0.021971290014960995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 692.0555555555555, 169, 1244, 777.0, 1237.7, 1244.0, 1244.0, 0.091896748897239, 56.54121477450835, 0.19448287657245547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36f2a17d-a357-41cf-9f96-5f2a5faa83c6", 3, 0, 0.0, 373.6666666666667, 221, 599, 301.0, 599.0, 599.0, 599.0, 0.027995520716685332, 0.023338713722471073, 0.017952856709593134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c1dea0d-daf4-4865-9cfb-3c2b36b62074", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/439f3eb4-6081-4d0c-84c8-7f411b257e31", 3, 0, 0.0, 295.3333333333333, 188, 439, 259.0, 439.0, 439.0, 439.0, 0.01665482323680938, 0.02296001836194262, 0.01068033911995914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 334.6666666666667, 168, 1059, 178.5, 988.8000000000001, 1059.0, 1059.0, 0.09563835948334033, 12.84472149312732, 0.21237402634836802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 618.1666666666667, 83, 1136, 888.0, 1110.8000000000002, 1136.0, 1136.0, 0.06641061684394611, 46.35334590177317, 0.10559331314266109], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 910.4583333333333, 116, 2033, 916.0, 1669.5, 1965.75, 2033.0, 0.09486915961736105, 0.029646612380425333, 0.042802296624239074], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 231.27777777777777, 169, 426, 173.0, 346.8000000000001, 426.0, 426.0, 0.08945744062262379, 0.13864156080869527, 0.2011918806190455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 103.33333333333334, 84, 252, 87.0, 210.90000000000015, 252.0, 252.0, 0.07165334113558604, 0.05562930293241298, 0.025470523606790346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=439f3eb4-6081-4d0c-84c8-7f411b257e31", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 302.625, 167, 1139, 250.5, 583.9000000000005, 1139.0, 1139.0, 0.13173061090070803, 10.041122398835007, 0.29415869936604644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 84.55555555555556, 83, 88, 84.0, 88.0, 88.0, 88.0, 0.06511452922195372, 0.0483907780643621, 0.03268444142586349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 138.2222222222222, 80, 250, 85.0, 250.0, 250.0, 250.0, 0.0650368903694818, 0.028256044817643784, 0.036484453473331256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 173.11111111111111, 81, 890, 84.0, 890.0, 890.0, 890.0, 0.06511405812514923, 6.525571794127436, 0.03765819550857697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 147.77777777777777, 82, 490, 84.0, 490.0, 490.0, 490.0, 0.06511452922195372, 2.1429152000824785, 0.03772205637109494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 87.0, 86, 88, 87.0, 88.0, 88.0, 88.0, 0.039904760637944105, 0.011768786828768672, 0.02466768894904162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7563f8ba-da4f-4cae-9875-d87d845de5cf", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.8144087357954546, 3.3902254971590913], "isController": false}, {"data": ["https://demoqa.com/books", 54, 1, 1.8518518518518519, 967.3888888888889, 650, 1663, 908.0, 1365.0, 1486.0, 1663.0, 0.23961448691438664, 285.3658650096844, 0.47091335967243814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a73755aa-5b1c-4997-b466-1c2de5f3a740", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 910.4583333333333, 116, 2033, 916.0, 1669.5, 1965.75, 2033.0, 0.0969583361949509, 0.030299480060922156, 0.04374487433795636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 84.22222222222223, 82, 91, 84.0, 91.0, 91.0, 91.0, 0.041811069712990236, 0.0112693898835794, 0.02462116702825499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 102.33333333333333, 82, 243, 84.0, 243.0, 243.0, 243.0, 0.04180990430177459, 0.011269075768837684, 0.024579650771160456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 140.16666666666666, 81, 247, 88.5, 246.7, 247.0, 247.0, 0.07122338026162722, 0.01919692671114171, 0.04187155753662069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 139.58333333333334, 82, 255, 84.5, 254.4, 255.0, 255.0, 0.07115411982353778, 0.01917825885868792, 0.041900326419524694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 104.0, 83, 244, 85.0, 244.0, 244.0, 244.0, 0.041808933175388474, 0.011187155947320745, 0.02384415720158874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 100.0, 82, 249, 84.5, 202.50000000000017, 249.0, 249.0, 0.07122211209173408, 0.05292971416192347, 0.03575016173354621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 89.22222222222223, 84, 118, 86.0, 118.0, 118.0, 118.0, 0.04181048699926135, 0.031072051373474498, 0.020986904607051104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 111.41666666666666, 82, 251, 84.0, 250.7, 251.0, 251.0, 0.07122464847668283, 0.019058157893174898, 0.04062030733435818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db5b5a5a-26d6-44ea-ae21-ed5e3d30d342", 3, 0, 0.0, 471.33333333333337, 289, 735, 390.0, 735.0, 735.0, 735.0, 0.0265981026686763, 0.026849191528504297, 0.01705672599521234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 90.22222222222223, 84, 103, 88.0, 103.0, 103.0, 103.0, 0.04146796599626788, 0.032639824797843664, 0.01474056603773585], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 447.5, 83, 829, 426.0, 782.0, 829.0, 829.0, 0.07658433850277618, 0.01478693142966549, 0.05211752277016493], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1253.2380952380956, 851, 2475, 1110.0, 1679.8, 2396.8999999999987, 2475.0, 0.08969605849891511, 0.04642471777775879, 0.04125668315721583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 194.44444444444446, 169, 329, 172.0, 329.0, 329.0, 329.0, 0.04179184873208175, 0.06476920306427121, 0.0939908472949065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03abaf7b-c0dd-4865-99bf-f79989537e6a", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["addBook", 58, 14, 24.137931034482758, 872.6206896551724, 427, 2246, 705.5, 1519.4, 2028.6499999999994, 2246.0, 0.28735062721705873, 78.15668539967747, 1.0464551986930501], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19844b06-e4ea-4501-8182-c8420b6cd235", 3, 0, 0.0, 296.0, 187, 497, 204.0, 497.0, 497.0, 497.0, 0.04972650422675286, 0.03196935086192607, 0.031888415796452844], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 150.50000000000006, 82, 459, 87.0, 341.0, 344.25, 459.0, 0.24040387851590672, 0.1786595229986377, 0.11621085924352913], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 1, 1.8518518518518519, 511.14814814814815, 1, 754, 490.5, 666.5, 730.25, 754.0, 0.24040387851590672, 69.3860868550832, 0.1186672429125375], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 129.9074074074074, 82, 261, 87.5, 252.5, 255.75, 261.0, 0.2408359684058889, 0.42616677221823307, 0.11712530494739519], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 815.3333333333333, 565, 1172, 809.0, 1049.5, 1144.25, 1172.0, 0.24013767893592328, 216.0763056235575, 0.12053785837213335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 97.9375, 84, 247, 88.0, 140.6000000000001, 247.0, 247.0, 0.13381059110828622, 0.0999659201150771, 0.04756548355802362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 14, 8.235294117647058, 143.81764705882358, 83, 935, 89.5, 281.70000000000005, 343.0, 822.1099999999988, 0.716921454928835, 1.5122232472324724, 0.344680745914602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 105.88888888888889, 84, 251, 87.0, 251.0, 251.0, 251.0, 0.0672836829592859, 0.05210543026046261, 0.023917246676933658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cbd9e21-f319-4d2e-8bc1-7c1809d2d065", 1, 0, 0.0, 873.0, 873, 873, 873.0, 873.0, 873.0, 873.0, 1.1454753722794961, 0.20694623424971365, 0.7897515750286369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 97.05555555555556, 85, 252, 87.0, 112.50000000000023, 252.0, 252.0, 0.0982924418572903, 0.0797666202962971, 0.034939891441458655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44ec8af8-9ed4-4df7-870e-3f7370451b7e", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3986687-252b-4ec2-8cf0-d96d1b7754d5", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 295.77777777777777, 166, 975, 170.0, 975.0, 975.0, 975.0, 0.0649974362122383, 8.729488569478647, 0.14433295704030563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81bda7a3-9c65-49e6-9e9a-15ea071d0a43", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 281.16666666666674, 168, 500, 329.5, 452.00000000000017, 500.0, 500.0, 0.07111406102771671, 0.11021290512791643, 0.1599371899871402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 89.25, 85, 99, 87.0, 99.0, 99.0, 99.0, 0.06166305252664358, 0.051124933198359764, 0.021919288202830334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 98.22222222222223, 84, 262, 88.0, 112.60000000000024, 262.0, 262.0, 0.08654262224145391, 0.06718885222847253, 0.03076319774989182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddc20985-da45-450b-98ce-f8ba55539997", 3, 0, 0.0, 470.0, 292, 715, 403.0, 715.0, 715.0, 715.0, 0.0842412669886555, 0.03806213495450971, 0.05402190623946984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36f2a17d-a357-41cf-9f96-5f2a5faa83c6", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 95.68750000000001, 82, 249, 84.0, 141.2000000000001, 249.0, 249.0, 0.13182612134594468, 0.09796843588307023, 0.06617053356622615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 113.81249999999999, 82, 251, 83.0, 247.5, 251.0, 251.0, 0.1318293798251613, 0.04764975508573029, 0.07449196767708394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 196.12499999999997, 81, 890, 85.5, 442.70000000000044, 890.0, 890.0, 0.13182394911595563, 7.4467738276937405, 0.07679002504655033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 139.37499999999997, 82, 649, 83.5, 368.3000000000003, 649.0, 649.0, 0.13182286302780638, 2.4558283985581872, 0.07691812564366632], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.857142857142858, 0.6220839813374806], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.2332814930015552], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 2.857142857142857, 0.07776049766718507], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.714285714285714, 0.15552099533437014], "isController": false}, {"data": ["401/Unauthorized", 20, 57.142857142857146, 1.5552099533437014], "isController": false}, {"data": ["Assertion failed", 1, 2.857142857142857, 0.07776049766718507], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1286, 35, "401/Unauthorized", 20, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 54, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
