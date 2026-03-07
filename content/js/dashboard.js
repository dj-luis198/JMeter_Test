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

    var data = {"OkPercent": 98.1637337413925, "KoPercent": 1.836266258607498};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7917763157894737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ea052ed-0252-4935-a53c-f8c0986c98e8"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84c97118-de5b-4f7f-878e-3ea27fc7ae5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fe81712-6915-4669-896e-c07fe84c5949"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49f905c9-a91e-4d1f-8f71-03e76389f47f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49b2ce97-59df-49b0-b216-ae6f73fda454"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b17eb095-694c-4f2b-a698-f490080b0ced"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f82d3373-adc7-43e8-99c0-e1a734ab3f9d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1cec16b-e652-4f1f-adb7-cc445ed2a45b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59556065-9214-4b8c-973d-1bd36408299d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b20a8d5e-6fe8-4633-baaf-179b8fdd2abd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/226f15fd-bb9d-4eef-9360-a536e69b161c"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49f905c9-a91e-4d1f-8f71-03e76389f47f"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1cec16b-e652-4f1f-adb7-cc445ed2a45b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84c97118-de5b-4f7f-878e-3ea27fc7ae5b"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b17eb095-694c-4f2b-a698-f490080b0ced"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=781ff37a-4416-4494-9d14-2fce7d97bcfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1fe81712-6915-4669-896e-c07fe84c5949"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59556065-9214-4b8c-973d-1bd36408299d"], "isController": false}, {"data": [0.328125, 500, 1500, "addBook"], "isController": true}, {"data": [0.9629629629629629, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49b2ce97-59df-49b0-b216-ae6f73fda454"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f82d3373-adc7-43e8-99c0-e1a734ab3f9d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b20a8d5e-6fe8-4633-baaf-179b8fdd2abd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9313186813186813, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4ea052ed-0252-4935-a53c-f8c0986c98e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=226f15fd-bb9d-4eef-9360-a536e69b161c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a925dc63-6efc-45ee-a013-e8aa0ae8fc70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/781ff37a-4416-4494-9d14-2fce7d97bcfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e792b9db-f1b4-4fe3-b5a5-85c5597f148d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1307, 24, 1.836266258607498, 355.5187452180566, 114, 2351, 133.0, 944.0000000000002, 1108.5999999999995, 1484.1600000000035, 5.218168969661158, 681.632667335989, 3.823659506739303], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ea052ed-0252-4935-a53c-f8c0986c98e8", 1, 0, 0.0, 1330.0, 1330, 1330, 1330.0, 1330.0, 1330.0, 1330.0, 0.7518796992481204, 0.1358376409774436, 0.5183858082706767], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1772.2407407407404, 1423, 2231, 1739.5, 2051.0, 2153.25, 2231.0, 0.2407028523288001, 289.6467537640466, 1.1835340444096762], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84c97118-de5b-4f7f-878e-3ea27fc7ae5b", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fe81712-6915-4669-896e-c07fe84c5949", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 490.57142857142856, 129, 936, 458.0, 891.5, 936.0, 936.0, 0.10594823671863175, 0.02087038368397155, 0.07128743662025126], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 490.57142857142856, 129, 936, 458.0, 891.5, 936.0, 936.0, 0.10682374844533295, 0.0210428477685282, 0.07187652605354923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49f905c9-a91e-4d1f-8f71-03e76389f47f", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 191.07142857142856, 119, 367, 125.5, 363.5, 367.0, 367.0, 0.125752268031977, 0.033648556094493846, 0.07171809036198688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 160.35714285714286, 121, 379, 125.0, 378.0, 379.0, 379.0, 0.12602167572822526, 0.09365478049724553, 0.06325697394951932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 244.42857142857147, 120, 376, 240.5, 376.0, 376.0, 376.0, 0.12602281012863328, 0.03396708554248319, 0.0742106977612948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 193.35714285714286, 119, 381, 124.0, 379.0, 381.0, 381.0, 0.12601940698867628, 0.03396616828991665, 0.07408562793670226], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 217.26666666666662, 120, 376, 211.0, 347.8, 376.0, 376.0, 0.10630381630700542, 0.23273338117005068, 0.06870299378122675], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/49b2ce97-59df-49b0-b216-ae6f73fda454", 3, 0, 0.0, 496.3333333333333, 211, 855, 423.0, 855.0, 855.0, 855.0, 0.015615321753704735, 0.021526981649394386, 0.010013731723567164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 123.84210526315792, 121, 128, 123.0, 128.0, 128.0, 128.0, 0.10525616025527389, 0.07822259565846038, 0.05283365856563552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b17eb095-694c-4f2b-a698-f490080b0ced", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 122.68421052631578, 119, 129, 122.0, 126.0, 129.0, 129.0, 0.10525441099077638, 0.02816377794089134, 0.06002790626817717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f82d3373-adc7-43e8-99c0-e1a734ab3f9d", 3, 0, 0.0, 314.6666666666667, 224, 443, 277.0, 443.0, 443.0, 443.0, 0.01690950596060085, 0.02331111905701322, 0.01084366104895302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 735.0, 595, 882, 731.5, 882.0, 882.0, 882.0, 0.08554136994503968, 25.15200300464062, 0.04878531254678043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1cec16b-e652-4f1f-adb7-cc445ed2a45b", 3, 0, 0.0, 283.0, 214, 421, 214.0, 421.0, 421.0, 421.0, 0.030604437643458306, 0.025513660418260645, 0.019625892629431266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1098.5, 1068, 1122, 1102.0, 1122.0, 1122.0, 1122.0, 0.08508827908955542, 76.56258309402256, 0.04844381514571368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 182.0, 119, 362, 123.5, 362.0, 362.0, 362.0, 0.08693006476289825, 0.15382546616247228, 0.0481341276568001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59556065-9214-4b8c-973d-1bd36408299d", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 155.25, 121, 372, 126.5, 350.3, 372.0, 372.0, 0.08806790035117076, 0.06544889860082123, 0.044205957793458754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b20a8d5e-6fe8-4633-baaf-179b8fdd2abd", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 169.25000000000003, 119, 375, 124.5, 375.0, 375.0, 375.0, 0.08806790035117076, 0.03183215978269246, 0.04976395394599236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 201.3125, 115, 1139, 124.0, 593.7000000000005, 1139.0, 1139.0, 0.08806838510103095, 4.975009090652642, 0.05130155440699703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 228.0625, 120, 828, 126.5, 508.8000000000003, 828.0, 828.0, 0.08807032415383685, 1.6407290674728772, 0.05138869011906007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 122.75, 120, 127, 122.0, 127.0, 127.0, 127.0, 0.08693195401299633, 0.06460470410536152, 0.04881432964596962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 732.8666666666667, 119, 1123, 872.0, 1105.6, 1123.0, 1123.0, 0.08053042707969828, 48.31484838469385, 0.04272936072262637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 162.3684210526316, 120, 378, 125.0, 371.0, 378.0, 378.0, 0.10525499407248191, 0.02836951012109864, 0.06187842424964268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 592.9999999999998, 121, 874, 631.0, 872.8, 874.0, 874.0, 0.0805308594253318, 15.793066225894428, 0.042808233542176694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 199.4736842105263, 119, 375, 126.0, 371.0, 375.0, 375.0, 0.10525382791553103, 0.028369195805357975, 0.06198052561822775], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 500.7857142857143, 122, 1330, 416.0, 1234.0, 1330.0, 1330.0, 0.10687186063909372, 0.021052325226339336, 0.07259473904181744], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 405.18750000000006, 247, 1268, 255.0, 904.0000000000003, 1268.0, 1268.0, 0.08800686453543376, 6.7082942430447074, 0.19652216466634398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/226f15fd-bb9d-4eef-9360-a536e69b161c", 3, 0, 0.0, 480.6666666666667, 207, 848, 387.0, 848.0, 848.0, 848.0, 0.025127522175038317, 0.02969988053957166, 0.016113677957299965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 514.5, 160, 1291, 470.5, 1161.4, 1291.0, 1291.0, 0.0783630822812364, 0.04813513550282978, 0.03543174521114497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 140.53333333333336, 119, 363, 124.0, 223.80000000000007, 363.0, 363.0, 0.08053129177560761, 0.05984796195433339, 0.04042293356705304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 238.2666666666667, 120, 379, 125.0, 379.0, 379.0, 379.0, 0.08053042707969828, 0.10218346509005986, 0.04141864413604274], "isController": false}, {"data": ["login", 18, 0, 0.0, 2223.3333333333335, 1447, 3806, 1894.5, 3451.4000000000005, 3806.0, 3806.0, 0.07722537797532221, 20.637342653292375, 0.1449735529894802], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 153.9473684210526, 122, 384, 129.0, 364.0, 384.0, 384.0, 0.10071187392993634, 0.08153334324991916, 0.035799923936032055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49f905c9-a91e-4d1f-8f71-03e76389f47f", 3, 0, 0.0, 299.3333333333333, 213, 396, 289.0, 396.0, 396.0, 396.0, 0.032265350240376856, 0.026898294910678754, 0.020690996085137504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 890.9333333333333, 243, 1248, 1001.0, 1232.4, 1248.0, 1248.0, 0.08047685217475281, 64.22710345534071, 0.16726715531764214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 475.7857142857143, 245, 755, 487.5, 751.0, 755.0, 755.0, 0.1256146143631339, 0.19467811815848976, 0.2825102117952123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 5, 55.55555555555556, 612.6666666666666, 120, 1243, 127.0, 1243.0, 1243.0, 1243.0, 0.08283936526637459, 44.058839104092264, 0.11335581981057398], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 924.190476190476, 165, 1538, 961.0, 1454.6000000000001, 1535.2, 1538.0, 0.08304563951074254, 0.026229816943683194, 0.0374678568886358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 128.53333333333336, 121, 136, 129.0, 134.2, 136.0, 136.0, 0.07323289035571656, 0.05685561311796354, 0.02603200399363362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 326.94736842105266, 242, 503, 253.0, 500.0, 503.0, 503.0, 0.10518215889149077, 0.16301180289140219, 0.23655714055381175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 469.375, 249, 1194, 491.5, 786.6000000000004, 1194.0, 1194.0, 0.08838021167060695, 6.73675250537186, 0.1973558608508805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1cec16b-e652-4f1f-adb7-cc445ed2a45b", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 125.74999999999999, 121, 132, 125.5, 131.1, 132.0, 132.0, 0.0566414454896889, 0.0420938867359895, 0.028431350568066494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 145.41666666666669, 119, 377, 125.0, 302.0000000000002, 377.0, 377.0, 0.05664091078584544, 0.022245201452839362, 0.03190660680823748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84c97118-de5b-4f7f-878e-3ea27fc7ae5b", 3, 0, 0.0, 504.33333333333337, 217, 860, 436.0, 860.0, 860.0, 860.0, 0.073857061966075, 0.04688192409955932, 0.04736276434673429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 227.50000000000003, 120, 1120, 124.5, 896.8000000000008, 1120.0, 1120.0, 0.05657388549445576, 4.2560845287513205, 0.03285410537829071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 224.83333333333331, 121, 865, 125.5, 713.5000000000005, 865.0, 865.0, 0.056578153289076644, 1.4003000852208434, 0.03291183591392577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 127.5, 122, 133, 127.5, 133.0, 133.0, 133.0, 0.07135466837917871, 0.021044052588390597, 0.0441088916836134], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1140.2592592592591, 930, 1685, 1005.0, 1545.5, 1626.5, 1685.0, 0.24803865728406854, 296.74046630119244, 0.48977945803553385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 924.190476190476, 165, 1538, 961.0, 1454.6000000000001, 1535.2, 1538.0, 0.08469654438098925, 0.026751252298906205, 0.03821269873439164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 144.9090909090909, 115, 362, 125.0, 314.8000000000002, 362.0, 362.0, 0.05466816424304472, 0.014734778643633147, 0.03219228812358981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b17eb095-694c-4f2b-a698-f490080b0ced", 3, 0, 0.0, 436.3333333333333, 376, 513, 420.0, 513.0, 513.0, 513.0, 0.017970205399447717, 0.0247733788628454, 0.011523862186494791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 145.8181818181818, 116, 362, 125.0, 315.20000000000016, 362.0, 362.0, 0.05466762086513995, 0.014734632186307252, 0.032138581797670165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 158.1333333333333, 115, 363, 126.0, 361.2, 363.0, 363.0, 0.07473953272844139, 0.020144639680712714, 0.04393867060793136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=781ff37a-4416-4494-9d14-2fce7d97bcfd", 1, 0, 0.0, 1138.0, 1138, 1138, 1138.0, 1138.0, 1138.0, 1138.0, 0.8787346221441125, 0.15875576669595784, 0.6058463312829526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fe81712-6915-4669-896e-c07fe84c5949", 3, 0, 0.0, 315.3333333333333, 197, 440, 309.0, 440.0, 440.0, 440.0, 0.02385685884691849, 0.02819799950298211, 0.015298832007952286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 161.0, 119, 378, 126.0, 375.6, 378.0, 378.0, 0.0747399051301471, 0.020144740054609957, 0.044011877728006535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 144.45454545454547, 120, 358, 123.0, 311.8000000000002, 358.0, 358.0, 0.05466789255274209, 0.014627932186964192, 0.031177782471485723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 126.73333333333333, 120, 139, 127.0, 133.6, 139.0, 139.0, 0.07474064994469191, 0.05554456504678765, 0.03751630280426919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 124.90909090909092, 117, 128, 126.0, 128.0, 128.0, 128.0, 0.054668707631751585, 0.040627818855237266, 0.027441128635469058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 143.20000000000002, 119, 357, 125.0, 245.40000000000006, 357.0, 357.0, 0.07473953272844139, 0.01999866403085248, 0.042624889759189225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 128.54545454545453, 121, 141, 129.0, 138.8, 141.0, 141.0, 0.05551518087855297, 0.04369651932432978, 0.019733911952923126], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 440.46153846153845, 126, 860, 423.0, 778.8, 860.0, 860.0, 0.0983574309039048, 0.019084829028304242, 0.0669335912378661], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 1114.0555555555557, 794, 2209, 1040.5, 1642.000000000001, 2209.0, 2209.0, 0.076641077062603, 0.039667744964042566, 0.035251901656724614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 315.45454545454544, 245, 488, 253.0, 488.0, 488.0, 488.0, 0.05463395251812854, 0.08467195570924804, 0.12287303969653322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59556065-9214-4b8c-973d-1bd36408299d", 2, 0, 0.0, 273.0, 217, 329, 273.0, 329.0, 329.0, 329.0, 0.02555420686130454, 0.029559529323452374, 0.015884035807832365], "isController": false}, {"data": ["addBook", 64, 10, 15.625, 1095.0781250000002, 642, 3106, 962.5, 1707.0, 1912.25, 3106.0, 0.32036361270041497, 79.02887746342098, 1.1701024803777287], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 205.79629629629636, 116, 614, 127.0, 490.5, 507.75, 614.0, 0.2490476234399934, 0.1850832435916357, 0.12038923203398116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49b2ce97-59df-49b0-b216-ae6f73fda454", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f82d3373-adc7-43e8-99c0-e1a734ab3f9d", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 713.7407407407408, 569, 1034, 626.5, 918.5, 969.5, 1034.0, 0.2486748852181201, 73.11867303742557, 0.1250659823118475], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 201.2407407407407, 115, 495, 126.5, 379.0, 409.0, 495.0, 0.2495448117785151, 0.4415773427174506, 0.12136066041572317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b20a8d5e-6fe8-4633-baaf-179b8fdd2abd", 3, 0, 0.0, 339.6666666666667, 200, 533, 286.0, 533.0, 533.0, 533.0, 0.036441820633358844, 0.030380046432953126, 0.02336926648688702], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 921.4074074074073, 799, 1248, 868.5, 1116.5, 1142.0, 1248.0, 0.2486851921783902, 223.76737306405485, 0.1248283093551685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 131.43750000000003, 122, 168, 129.0, 149.10000000000002, 168.0, 168.0, 0.09380313067948644, 0.07007753415020226, 0.033344081608723694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, 5.4945054945054945, 188.50549450549454, 118, 2351, 130.0, 269.6000000000003, 378.09999999999997, 1076.9499999999807, 0.7777378937832248, 1.5248408401599063, 0.37878249165641076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 167.25, 122, 379, 128.5, 370.00000000000006, 379.0, 379.0, 0.060100668619938395, 0.046542802944932765, 0.021363909548493727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ea052ed-0252-4935-a53c-f8c0986c98e8", 3, 0, 0.0, 598.3333333333334, 199, 939, 657.0, 939.0, 939.0, 939.0, 0.01705223668504519, 0.02350788488319218, 0.010935190842948899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 146.35714285714283, 122, 364, 127.5, 264.5, 364.0, 364.0, 0.12865163892998593, 0.10440382026447101, 0.04573163727589344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 396.1666666666667, 243, 1250, 255.0, 1026.2000000000007, 1250.0, 1250.0, 0.05654109831083468, 5.717226224762645, 0.12595670777675688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=226f15fd-bb9d-4eef-9360-a536e69b161c", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 321.4666666666667, 250, 506, 255.0, 499.4, 506.0, 506.0, 0.07469301172182331, 0.1157595796899742, 0.16798633397984283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a925dc63-6efc-45ee-a013-e8aa0ae8fc70", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 128.0, 122, 136, 128.0, 133.2, 136.0, 136.0, 0.0900905973569671, 0.0746942550352198, 0.0320243920292344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/781ff37a-4416-4494-9d14-2fce7d97bcfd", 3, 0, 0.0, 330.0, 291, 400, 299.0, 400.0, 400.0, 400.0, 0.0332086165290354, 0.02768465720405588, 0.021295890156966063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 143.6, 122, 364, 127.0, 229.60000000000008, 364.0, 364.0, 0.0799637497667724, 0.062081231508382864, 0.028424614174907374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e792b9db-f1b4-4fe3-b5a5-85c5597f148d", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 124.625, 117, 131, 126.0, 131.0, 131.0, 131.0, 0.08856366343593802, 0.0658173319089344, 0.04445480762311733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 253.74999999999997, 114, 484, 242.5, 407.70000000000005, 484.0, 484.0, 0.08844225549862085, 0.031967470523854534, 0.04997548836707958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 256.9375, 115, 1068, 126.5, 582.2000000000005, 1068.0, 1068.0, 0.08856366343593802, 5.002987510101793, 0.051590063710485384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 229.375, 119, 599, 127.0, 441.50000000000017, 599.0, 599.0, 0.08844372215404686, 1.6476853828784008, 0.051606566393596676], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.833333333333332, 0.38255547054322875], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.22953328232593725], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1530221882172915], "isController": false}, {"data": ["401/Unauthorized", 14, 58.333333333333336, 1.0711553175210407], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1307, 24, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
