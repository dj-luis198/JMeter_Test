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

    var data = {"OkPercent": 97.53363228699551, "KoPercent": 2.4663677130044843};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7975811584977721, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37037037037037035, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d10a5005-2631-4063-a83e-f0f645101895"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65071e2b-e3d9-4b14-9146-c37dafe36d6b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8403760e-169c-4dcb-94de-fdd3998cc351"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7483da84-c50a-4bb1-a286-04b8eee4e949"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60011557-762b-484d-b71e-079de120ec9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c1f50ad-c2ec-4427-a6b2-3ded41f65a8b"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5efc6812-0daf-431f-86bf-34715b2a24e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ce68fb6-0239-4917-be2a-d6610f50d655"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a174943e-9fee-45d6-8c6e-bfd4db4d04c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30b77eee-8a6a-42ab-985c-3f104d428429"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5c844f1-a56e-406a-b6f1-26632d50960c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a22a511-1d31-479d-995c-f91ea2d0c084"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cd2d3e9-b9ef-4a36-ab53-194a93d9ccde"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9425c86a-5719-461f-adbb-4c64de3fdcb6"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "register"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60011557-762b-484d-b71e-079de120ec9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a22a511-1d31-479d-995c-f91ea2d0c084"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7483da84-c50a-4bb1-a286-04b8eee4e949"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d584aed8-983f-4adc-a697-45e4dd671558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5c844f1-a56e-406a-b6f1-26632d50960c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d10a5005-2631-4063-a83e-f0f645101895"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8403760e-169c-4dcb-94de-fdd3998cc351"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65071e2b-e3d9-4b14-9146-c37dafe36d6b"], "isController": false}, {"data": [0.38524590163934425, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9460227272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ce68fb6-0239-4917-be2a-d6610f50d655"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a174943e-9fee-45d6-8c6e-bfd4db4d04c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30b77eee-8a6a-42ab-985c-3f104d428429"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c1f50ad-c2ec-4427-a6b2-3ded41f65a8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0cd2d3e9-b9ef-4a36-ab53-194a93d9ccde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9425c86a-5719-461f-adbb-4c64de3fdcb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 33, 2.4663677130044843, 306.1689088191331, 77, 2062, 100.0, 861.1000000000001, 1031.0, 1550.109999999995, 5.27527638032456, 729.7597145552584, 3.855750095609456], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1349.6111111111109, 963, 1852, 1288.5, 1628.0, 1739.75, 1852.0, 0.24485798237022527, 294.6458739658718, 1.2039647863614105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d10a5005-2631-4063-a83e-f0f645101895", 1, 0, 0.0, 2062.0, 2062, 2062, 2062.0, 2062.0, 2062.0, 2062.0, 0.48496605237633367, 0.08761593719689623, 0.3343613603297769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65071e2b-e3d9-4b14-9146-c37dafe36d6b", 3, 0, 0.0, 297.0, 192, 448, 251.0, 448.0, 448.0, 448.0, 0.02184185044156941, 0.026200266561583096, 0.014006655393844967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8403760e-169c-4dcb-94de-fdd3998cc351", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.23897362764550265, 0.911975033068783], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 524.9411764705882, 83, 1623, 490.0, 1238.1999999999996, 1623.0, 1623.0, 0.0972612379639218, 0.020186400089823614, 0.0650121648063071], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 524.9411764705882, 83, 1623, 490.0, 1238.1999999999996, 1623.0, 1623.0, 0.09854729690561487, 0.02045331937729702, 0.06587180300975039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 115.43750000000001, 78, 316, 80.0, 269.1, 316.0, 316.0, 0.07532034685019726, 0.02722455408000904, 0.042560777047065804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 80.8125, 79, 83, 81.0, 82.3, 83.0, 83.0, 0.07532034685019726, 0.05597537495410167, 0.037807283477540414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 133.87499999999997, 78, 625, 80.5, 355.5000000000003, 625.0, 625.0, 0.07532105600120513, 1.4032132521513576, 0.04394954195382819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 139.5, 79, 704, 81.5, 378.50000000000034, 704.0, 704.0, 0.07526542823676621, 4.2517662752668395, 0.04384358197581158], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 226.35294117647058, 79, 943, 192.0, 474.1999999999996, 943.0, 943.0, 0.09802056125420192, 0.1890195439305092, 0.0633462381726661], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 100.41176470588235, 79, 256, 81.0, 239.2, 256.0, 256.0, 0.09431031421977631, 0.07008803625122048, 0.04733935694234866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 107.70588235294117, 78, 240, 80.0, 239.2, 240.0, 240.0, 0.09431136063554761, 0.04190050914265426, 0.05285510307676945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 601.2222222222222, 459, 706, 624.0, 706.0, 706.0, 706.0, 0.087975679612125, 25.86777087345187, 0.05017362977879004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 839.5555555555555, 716, 944, 855.0, 944.0, 944.0, 944.0, 0.08776977014072421, 78.9753934554227, 0.04997048436722872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 168.0, 79, 239, 233.0, 239.0, 239.0, 239.0, 0.0884486113568017, 0.1565125818149655, 0.04897496351494781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 108.16666666666666, 80, 242, 81.0, 239.9, 242.0, 242.0, 0.058522311631309436, 0.04349167885881492, 0.02937545720555962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 132.08333333333331, 80, 236, 80.5, 236.0, 236.0, 236.0, 0.058526022132590706, 0.015660283265947122, 0.03337812199749313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 107.66666666666667, 78, 263, 79.0, 255.8, 263.0, 263.0, 0.05852630757525507, 0.01577466883864297, 0.03440706753935894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 119.08333333333334, 79, 239, 80.0, 239.0, 239.0, 239.0, 0.05852630757525507, 0.01577466883864297, 0.0344642221366004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 98.44444444444444, 80, 237, 80.0, 237.0, 237.0, 237.0, 0.08844687291167105, 0.06573053738845866, 0.04966499211348716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 571.0, 78, 1086, 822.0, 1026.8, 1086.0, 1086.0, 0.11824441816790707, 62.59932042063713, 0.06353735567225428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 187.58823529411768, 79, 937, 81.0, 775.3999999999999, 937.0, 937.0, 0.09423033218963577, 9.997541610313233, 0.054444432511681795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 413.3529411764706, 78, 708, 553.0, 651.1999999999999, 708.0, 708.0, 0.1181129715834086, 20.442011741818938, 0.06358206897450148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 177.6470588235294, 79, 706, 81.0, 642.0, 706.0, 706.0, 0.09422719840368039, 3.281929856164953, 0.05453464062023668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7483da84-c50a-4bb1-a286-04b8eee4e949", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 504.70588235294105, 79, 2062, 410.0, 1231.5999999999992, 2062.0, 2062.0, 0.09862791169901082, 0.020470050836886838, 0.06634494749514112], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/60011557-762b-484d-b71e-079de120ec9b", 3, 0, 0.0, 351.6666666666667, 235, 412, 408.0, 412.0, 412.0, 412.0, 0.025367619079831896, 0.025441938276354843, 0.016267646350022407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 282.5, 160, 482, 314.0, 479.6, 482.0, 482.0, 0.05849948812947887, 0.09066278091941696, 0.131566719884951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 615.3333333333331, 100, 1974, 524.5, 1252.0, 1824.25, 1974.0, 0.10603282599571451, 0.06513149174932073, 0.0479425765976717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 90.00000000000001, 78, 239, 81.0, 114.99999999999989, 239.0, 239.0, 0.11824030603373326, 0.08787194618327247, 0.059351091114588764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 144.52941176470588, 77, 243, 81.0, 239.8, 243.0, 243.0, 0.11811461286198655, 0.13595936423072646, 0.06152707430103941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c1f50ad-c2ec-4427-a6b2-3ded41f65a8b", 1, 0, 0.0, 1024.0, 1024, 1024, 1024.0, 1024.0, 1024.0, 1024.0, 0.9765625, 0.17642974853515625, 0.6732940673828125], "isController": false}, {"data": ["login", 24, 0, 0.0, 2579.8749999999995, 1487, 4583, 2331.5, 4156.0, 4522.0, 4583.0, 0.10269971885951963, 46.210949535123305, 0.218813585568122], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5efc6812-0daf-431f-86bf-34715b2a24e2", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 86.82352941176471, 81, 108, 83.0, 100.0, 108.0, 108.0, 0.08970834234814225, 0.0726252107486425, 0.03188851231906619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ce68fb6-0239-4917-be2a-d6610f50d655", 3, 0, 0.0, 318.0, 210, 437, 307.0, 437.0, 437.0, 437.0, 0.035351511866324146, 0.029471100875539114, 0.02267007759656855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a174943e-9fee-45d6-8c6e-bfd4db4d04c7", 3, 0, 0.0, 893.3333333333334, 204, 1488, 988.0, 1488.0, 1488.0, 1488.0, 0.018867568536442707, 0.02601046639057125, 0.012099319666924525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30b77eee-8a6a-42ab-985c-3f104d428429", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 681.1176470588234, 161, 1169, 903.0, 1109.8, 1169.0, 1169.0, 0.11804407904787036, 83.14695234708083, 0.24771761556168148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5c844f1-a56e-406a-b6f1-26632d50960c", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a22a511-1d31-479d-995c-f91ea2d0c084", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.0949337121212122, 4.178503787878788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cd2d3e9-b9ef-4a36-ab53-194a93d9ccde", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 261.3125, 160, 785, 166.5, 467.20000000000033, 785.0, 785.0, 0.07523569933933652, 5.7348163852185365, 0.16800374121270545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 534.7058823529411, 79, 1093, 799.0, 1038.6, 1093.0, 1093.0, 0.16565648691313753, 104.94113865691567, 0.24940779328506557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9425c86a-5719-461f-adbb-4c64de3fdcb6", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 944.5384615384615, 103, 1834, 995.0, 1409.3000000000002, 1749.2999999999997, 1834.0, 0.10238437456929651, 0.031948970249463464, 0.04619295024513182], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 308.4117647058824, 160, 1019, 164.0, 997.4, 1019.0, 1019.0, 0.09418439087630266, 13.384944806908146, 0.20898784848224622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 85.05, 80, 111, 83.0, 91.60000000000001, 110.04999999999998, 111.0, 0.14128284826222098, 0.10968736754732976, 0.05022163746821136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60011557-762b-484d-b71e-079de120ec9b", 1, 0, 0.0, 859.0, 859, 859, 859.0, 859.0, 859.0, 859.0, 1.1641443538998835, 0.2103190483119907, 0.8026229627473807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 241.00000000000003, 161, 477, 165.0, 367.8000000000001, 477.0, 477.0, 0.09623249771447817, 0.14914157604773132, 0.2164291428090266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a22a511-1d31-479d-995c-f91ea2d0c084", 3, 0, 0.0, 317.6666666666667, 184, 428, 341.0, 428.0, 428.0, 428.0, 0.07560483870967742, 0.03420922064012097, 0.04848357169858871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 106.91666666666666, 79, 243, 81.0, 240.60000000000002, 243.0, 243.0, 0.060225544664769565, 0.04475746043934535, 0.03023040034930816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 94.33333333333334, 79, 236, 80.0, 192.50000000000017, 236.0, 236.0, 0.06022614919020924, 0.016115200076286456, 0.03434772571004121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7483da84-c50a-4bb1-a286-04b8eee4e949", 3, 0, 0.0, 314.0, 168, 571, 203.0, 571.0, 571.0, 571.0, 0.05040068544932211, 0.03240278442786822, 0.03232075206222804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 133.08333333333334, 79, 239, 80.5, 238.7, 239.0, 239.0, 0.06022675372778511, 0.01623299221569208, 0.03540674389074867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 132.25, 77, 238, 81.5, 237.4, 238.0, 238.0, 0.060226451457480124, 0.01623291074439894, 0.035465381082871596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 84.5, 79, 89, 85.0, 89.0, 89.0, 89.0, 0.06741270055278414, 0.019881480045840637, 0.04167210883780505], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 920.8888888888888, 625, 1507, 866.5, 1250.0, 1396.75, 1507.0, 0.23794206551338204, 284.66143240021853, 0.46984263326958836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 944.5384615384615, 103, 1834, 995.0, 1409.3000000000002, 1749.2999999999997, 1834.0, 0.10377004557899695, 0.03238136788875851, 0.04681812603271151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 117.2, 80, 235, 91.0, 235.0, 235.0, 235.0, 0.02454626234063339, 0.006615984771498844, 0.014454488468165952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 145.4, 81, 236, 94.0, 236.0, 236.0, 236.0, 0.024527478133753243, 0.006610921840738178, 0.014419474449726027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 159.54999999999998, 77, 867, 81.0, 249.8, 836.1999999999996, 867.0, 0.14063115261292683, 6.363017182050543, 0.08207146172020026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d584aed8-983f-4adc-a697-45e4dd671558", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5c844f1-a56e-406a-b6f1-26632d50960c", 3, 0, 0.0, 369.3333333333333, 196, 497, 415.0, 497.0, 497.0, 497.0, 0.0644288383480446, 0.029152371518158193, 0.04131667042501557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 114.60000000000001, 77, 463, 80.0, 237.70000000000002, 451.74999999999983, 463.0, 0.1406321414759343, 2.103535470062933, 0.08220937489013114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 82.6, 80, 91, 80.0, 91.0, 91.0, 91.0, 0.02454626234063339, 0.006568042852864794, 0.013999040241142482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 89.55, 78, 240, 80.0, 98.80000000000003, 232.9999999999999, 240.0, 0.1406301637638257, 0.10451128381276499, 0.07058975017051407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 128.0, 81, 240, 82.0, 240.0, 240.0, 240.0, 0.02453698705428563, 0.018235006980772815, 0.012316417329983217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 119.7, 77, 251, 80.0, 238.8, 250.39999999999998, 251.0, 0.1406301637638257, 0.04819055123508441, 0.07961260345106422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 117.8, 81, 243, 89.0, 243.0, 243.0, 243.0, 0.026378542638276322, 0.020762798209424525, 0.009376747578449786], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 483.5882352941177, 79, 1299, 448.0, 1050.1999999999998, 1299.0, 1299.0, 0.10178299864688484, 0.020470029771527107, 0.06925664171486391], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d10a5005-2631-4063-a83e-f0f645101895", 3, 0, 0.0, 419.33333333333337, 203, 850, 205.0, 850.0, 850.0, 850.0, 0.02024742351535767, 0.02791270787354809, 0.012984187605877152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1336.7916666666667, 885, 2050, 1235.0, 1914.0, 2022.25, 2050.0, 0.10485385993271877, 0.05427006422298921, 0.048228679715147015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 277.2, 167, 475, 251.0, 475.0, 475.0, 475.0, 0.02450860251948434, 0.03798354706877114, 0.05512042148669183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8403760e-169c-4dcb-94de-fdd3998cc351", 3, 0, 0.0, 545.3333333333334, 204, 943, 489.0, 943.0, 943.0, 943.0, 0.02350249909907087, 0.0279168682332388, 0.015071589591526565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65071e2b-e3d9-4b14-9146-c37dafe36d6b", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 859.3278688524591, 411, 2437, 713.0, 1512.2000000000003, 1602.3, 2437.0, 0.28190624075717247, 78.50653742305346, 1.0270776215547361], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 146.5185185185185, 79, 425, 82.0, 326.0, 327.25, 425.0, 0.23862868051596822, 0.17734025964126154, 0.11535273130410574], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 516.1851851851851, 384, 788, 473.5, 692.0, 738.25, 788.0, 0.23850747323416133, 70.12911632429066, 0.11995248898007138], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 129.2592592592593, 79, 333, 84.0, 239.0, 258.75, 333.0, 0.23891691000796392, 0.42277093841252983, 0.11619201287496682], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 770.8888888888889, 540, 1179, 709.0, 1002.5, 1068.0, 1179.0, 0.23832641892488304, 214.44653068176802, 0.11962869074940417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 122.12499999999999, 82, 243, 93.5, 241.6, 243.0, 243.0, 0.10547410610695074, 0.07879657340997785, 0.037492748655205146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, 4.545454545454546, 151.52272727272725, 80, 1337, 87.0, 292.50000000000006, 324.7500000000002, 1268.4699999999991, 0.7587874920779999, 1.5900333289861133, 0.3673103381562326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 86.08333333333333, 82, 102, 84.0, 100.2, 102.0, 102.0, 0.06108766589119268, 0.04730714751144121, 0.0217147562347599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 87.18749999999999, 82, 99, 83.0, 98.3, 99.0, 99.0, 0.07568232344732984, 0.06141797928196396, 0.026902700912918028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ce68fb6-0239-4917-be2a-d6610f50d655", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a174943e-9fee-45d6-8c6e-bfd4db4d04c7", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 255.33333333333331, 161, 480, 170.5, 478.2, 480.0, 480.0, 0.06020076956650429, 0.0932994348652757, 0.13539294171060487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 258.40000000000003, 160, 946, 164.0, 461.8000000000003, 922.4999999999997, 946.0, 0.14055011314284108, 8.614273885174072, 0.31430244539628105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30b77eee-8a6a-42ab-985c-3f104d428429", 3, 0, 0.0, 286.3333333333333, 180, 453, 226.0, 453.0, 453.0, 453.0, 0.0317346140013117, 0.026145933605898404, 0.02035064765058074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c1f50ad-c2ec-4427-a6b2-3ded41f65a8b", 3, 0, 0.0, 638.0, 258, 1299, 357.0, 1299.0, 1299.0, 1299.0, 0.017969559566095035, 0.024772488529431144, 0.011523448029038808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 100.5, 80, 239, 85.5, 200.00000000000014, 239.0, 239.0, 0.0595699052838506, 0.04938950154881754, 0.02117523976886877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cd2d3e9-b9ef-4a36-ab53-194a93d9ccde", 3, 0, 0.0, 778.6666666666666, 269, 1451, 616.0, 1451.0, 1451.0, 1451.0, 0.023885350318471336, 0.023955326930732487, 0.015317102906050956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 98.88235294117646, 81, 240, 88.0, 142.39999999999992, 240.0, 240.0, 0.11496273854768249, 0.08925329799356209, 0.04086566096812151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9425c86a-5719-461f-adbb-4c64de3fdcb6", 3, 0, 0.0, 318.0, 188, 495, 271.0, 495.0, 495.0, 495.0, 0.029578797917652624, 0.029665454552176996, 0.018968174445890516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 90.625, 79, 239, 81.0, 129.1000000000001, 239.0, 239.0, 0.09637160892401099, 0.07161991639762925, 0.0483740302606852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 129.31249999999997, 78, 240, 80.5, 238.6, 240.0, 240.0, 0.09627940282700397, 0.025762262084569422, 0.0549093469247757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 109.1875, 79, 233, 81.0, 233.0, 233.0, 233.0, 0.09637276987387214, 0.025975473130067102, 0.056656647914131865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 129.0, 79, 240, 80.5, 239.3, 240.0, 240.0, 0.09627940282700397, 0.025950307793215915, 0.056695781156917376], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 27.272727272727273, 0.672645739910314], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.121212121212121, 0.29895366218236175], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 12.121212121212121, 0.29895366218236175], "isController": false}, {"data": ["401/Unauthorized", 16, 48.484848484848484, 1.195814648729447], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 33, "401/Unauthorized", 16, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
